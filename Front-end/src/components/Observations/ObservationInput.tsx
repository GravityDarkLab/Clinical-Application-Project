import React, { useState } from "react";
import { fhirR4 } from "@smile-cdr/fhirts";
import { useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import SubmissionStatus from "../elements/SubmissonStatus";
import { useAuth0 } from "@auth0/auth0-react";
import Banner from "../elements/Banner";
import { post } from "../Utils/utils";

const ObservationInput: React.FC = () => {
  // State variables
  const { patientId } = useParams<{ patientId: string }>();
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [submissionStatus, setSubmissionStatus] = useState<
    "success" | "failure" | null
  >(null);
  const { getAccessTokenSilently } = useAuth0();

  /**
   * Handles the submission of the form.
   *
   * This function gathers the data from the form, constructs Observation and Media instances according to the FHIR R4 specification,
   * and sends them to a FHIR server. If any selected files are detected, they are also sent as Media instances.
   *
   * If the API request succeeds, the submission status is updated to 'success'; if it fails, it's updated to 'failure'.
   *
   * @param {React.FormEvent<HTMLFormElement>} e - The event object from the form submission event.
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // 1. Extract form data
    // Extract the values from the form and prepare them for the FHIR objects.
    const formData = new FormData(e.currentTarget);
    const newIdentifierValue = formData.get("identifier") as string;
    const statusObservationValue = formData.get("statusObservation") as string;
    const categoryValue = formData.get("category") as string;
    const issueDateValue = formData.get("issueDate") as string;
    const bodySiteValue = formData.get("bodySite") as string;
    const performerValue = formData.get("performer") as string;
    const lowValue = parseFloat(formData.get("low") as string);
    const highValue = parseFloat(formData.get("high") as string);
    const rangeUnitValue = formData.get("unit") as string;
    const interpretationValue = formData.get("interpretation") as string;
    const noteValue = formData.get("note") as string;
    const typeOfMediaValue = formData.get("typeOfMedia") as string;
    const statusMediaValue = formData.get("statusMedia") as string;
    const loincCodeValue = formData.get("loinc") as string;

    //define the patient reference
    const newPatientReference = new fhirR4.Reference();
    newPatientReference.type = "Patient";
    newPatientReference.reference = "Patient/" + patientId;

    //Identifier
    const newIdentifier = new fhirR4.Identifier();
    newIdentifier.value = newIdentifierValue;
    //Observation Status
    const statusObservation: fhirR4.Observation.StatusEnum | undefined = [
      "registered",
      "preliminary",
      "final",
    ].includes(statusObservationValue)
      ? (statusObservationValue as fhirR4.Observation.StatusEnum)
      : "preliminary";

    //Category
    const observationCategory = new fhirR4.CodeableConcept();
    const newCategoryCoding = new fhirR4.Coding();
    newCategoryCoding.system =
      "http://hl7.org/fhir/ValueSet/observation-category";
    newCategoryCoding.code = categoryValue;
    observationCategory.coding = [newCategoryCoding];
    //Issue Date
    const issueDate = new Date(issueDateValue).toISOString();
    //Body site
    const bodySite = new fhirR4.CodeableConcept();
    const bodySiteCoding = new fhirR4.Coding();
    bodySiteCoding.system = "http://hl7.org/fhir/ValueSet/body-site";
    bodySiteCoding.code = bodySiteValue;
    bodySite.coding = [bodySiteCoding];
    bodySite.text = bodySiteValue;

    //Performer {observation.performer?.[0]?.display || "-"}
    const performer = new fhirR4.Reference();
    performer.type = "Practitioner"; // fhirR4.Practitioner | fhirR4.PractitionerRole | fhirR4.Organization | fhirR4.CareTeam | fhirR4.Patient | fhirR4.RelatedPerson;
    //performer.reference = performerValue; // Set the performer reference value
    performer.display = performerValue;

    //Range
    const range = new fhirR4.ObservationReferenceRange();
    range.low = new fhirR4.Quantity();
    range.low.value = lowValue;
    range.low.system = "";
    range.low.unit = rangeUnitValue;
    range.low.code = rangeUnitValue;
    range.high = new fhirR4.Quantity();
    range.high.value = highValue; // Assign the high value
    range.high.system = "";
    range.high.unit = rangeUnitValue;
    range.high.code = rangeUnitValue;

    //Interpretation
    const interpretationSystem =
      "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation";
    const interpretationCode: string = interpretationValue[0].toUpperCase();
    const interpretationDisplay: string = interpretationValue;
    const interpretation = new fhirR4.CodeableConcept();
    const interpretationCoding = new fhirR4.Coding();
    interpretationCoding.system = interpretationSystem;
    interpretationCoding.code = interpretationCode;
    interpretationCoding.display = interpretationDisplay;
    interpretation.coding = [interpretationCoding];

    //Note
    const note = new fhirR4.Annotation();
    note.text = noteValue;
    note.time = new Date().toISOString();

    //Type of media
    const typeOfMedia = new fhirR4.CodeableConcept();
    const typeOfMediaCoding = new fhirR4.Coding();
    typeOfMediaCoding.system =
      "http://terminology.hl7.org/CodeSystem/media-type";
    typeOfMediaCoding.code = typeOfMediaValue;
    typeOfMedia.coding = [typeOfMediaCoding];

    //Media Status
    let statusValueMedia = statusMediaValue;
    const statusMedia: fhirR4.Code =
      statusValueMedia === "preparation" ||
      statusValueMedia === "in-progress" ||
      statusValueMedia === "not-done" ||
      statusValueMedia === "on-hold" ||
      statusValueMedia === "stopped" ||
      statusValueMedia === "completed" ||
      statusValueMedia === "entered-in-error" ||
      statusValueMedia === "unknown"
        ? statusValueMedia
        : "preliminary";

    //LoincCode
    const newObservationCoding = new fhirR4.CodeableConcept();
    const newTypeOfObservationCoding = new fhirR4.Coding();
    newTypeOfObservationCoding.system = "http://loinc.org";
    newTypeOfObservationCoding.code = loincCodeValue;
    newObservationCoding.coding = [newTypeOfObservationCoding];

    const token = await getAccessTokenSilently();

    if (selectedFiles) {
      const derivedFrom: fhirR4.Reference[] = [];

      for (let i = 0; i < selectedFiles.length; ++i) {
        const file: string = selectedFiles[i];

        const fileDataAsString = file.split(",")[1];
        let fileMetaDataAsString = file.split(",")[0];
        fileMetaDataAsString = fileMetaDataAsString.split(";")[0];
        fileMetaDataAsString = fileMetaDataAsString.split(":")[1];

        const photoAttachment: fhirR4.Attachment = {
          contentType: fileMetaDataAsString,
          data: fileDataAsString,
          id: uuidv4(), // Generate a unique ID for the attachment
        };

        const mediaIdentifier = new fhirR4.Identifier();
        mediaIdentifier.value = uuidv4();

        //references the Media: Observation -> Media
        const referenceMedia = new fhirR4.Reference();
        referenceMedia.type = "Media";
        referenceMedia.identifier = mediaIdentifier;

        //references the Oberservation: Media -> Observation
        const referenceObservation = new fhirR4.Reference();
        referenceObservation.type = "Observation";
        referenceObservation.identifier = newIdentifier;

        const media: fhirR4.Media = {
          identifier: [mediaIdentifier],
          partOf: [referenceObservation],
          status: statusMedia,
          type: typeOfMedia,
          subject: newPatientReference,
          createdDateTime: new Date().toISOString(),
          bodySite: bodySite,
          content: photoAttachment,
          note: [note],
          resourceType: "Media",
        };

        derivedFrom.push(referenceMedia);

        fetch("http://localhost:8080/fhir/Media", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(media),
        })
          .then((response) => {
            if (!response.ok) {
              setSubmissionStatus("failure");
            }
            response.json();
          })
          .then((data) => {
            // Handle the response from the API
            console.log("Response from API:", data);
          })
          .catch((error) => {
            // Handle any errors that occur during the request
            console.error("Error:", error);
            setSubmissionStatus("failure");
          });
      }

      const observation: fhirR4.Observation = {
        identifier: [newIdentifier],
        status: statusObservation,
        category: [observationCategory],
        issued: issueDate,
        bodySite: bodySite,
        interpretation: [interpretation],
        code: newObservationCoding,
        referenceRange: [range],
        performer: [performer],
        note: [note],
        derivedFrom: derivedFrom,
        subject: newPatientReference,
        resourceType: "Observation",
      };

      try {
        await post("Observation", observation, token, setSubmissionStatus);
        setSubmissionStatus("success");
      } catch (error) {
        setSubmissionStatus("failure");
      }
    }
  };
  /**
   * Handles the change event from a file input element.
   *
   * When files are selected from the file input, this function reads each file, converts them to base64,
   * and adds them to the state. The base64 strings can then be sent to a server or used in a `src` attribute of an image tag.
   *
   * If any error occurs while reading a file, it will be logged in the console.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - The event object from the file input change event.
   */
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files); // Convert FileList to an array
      // For each file, we create a new Promise that resolves with the base64 string of the file.
      // The FileReader API is used to read the file as a data URL, and the base64 part of the data URL is extracted.
      Promise.all(
        files.map((file) => {
          return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            // When the file is successfully read, resolve the Promise with the base64 string
            reader.onload = (event: ProgressEvent<FileReader>) => {
              if (event.target && event.target.result) {
                const base64Binary = event.target.result.toString();
                resolve(base64Binary);
              }
            };
            // If there's an error reading the file, reject the Promise with the error
            reader.onerror = (event: ProgressEvent<FileReader>) => {
              reject(event.target?.error);
            };
            // Read the file as a data URL
            reader.readAsDataURL(file); // Read the file as data URL
          });
        })
      )
        // When all Promises have resolved, the base64 strings will be set in the state
        .then((base64Binaries) => {
          setSelectedFiles((prevPhotoFiles) => [
            ...(prevPhotoFiles || []),
            ...base64Binaries,
          ]); // Append the new base64 binaries to the existing state
        })
        .catch((error) => {
          console.error("Error converting files:", error);
        });
    }
  };

  return (
    <div>
      <Banner>Enter new Observation</Banner>
      <form
        className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3"
        onSubmit={handleSubmit}
      >
        {/*Identifier*/}
        <div className="p-3 font-mono md:font-mono text-lg/5 md:text-lg/5">
          <label>
            Identifier:
            <input
              className="rounded border-b-2"
              type="text"
              name="identifier"
              required
              defaultValue={uuidv4()}
            />
          </label>
          <br />
        </div>
        {/*LOINC Code*/}
        <div className="p-3 font-mono md:font-mono text-lg/5 md:text-lg/5">
          <label>
            LOINC Code:
            <input
              className="rounded border-b-2"
              type="text"
              name="loinc"
              required
            />
          </label>
          <br />
        </div>
        {/*Status*/}
        <div className="p-3 font-mono md:font-mono text-lg/5 md:text-lg/5">
          <label>
            Status:
            <select
              className="text-sm"
              name="statusObservation"
              defaultValue=""
              required
            >
              <option value="" disabled>
                Select Status
              </option>
              <option value="registered">registered</option>
              <option value="preliminary">preliminary</option>
              <option value="final">final</option>
            </select>
          </label>
          <br />
        </div>
        {/*Category*/}
        <div className="p-3 font-mono md:font-mono text-lg/5 md:text-lg/5">
          <label>
            Category
            <select
              className="text-sm"
              name="category"
              defaultValue=""
              required
            >
              <option value="" disabled>
                Select category
              </option>
              <option value="vital-signs">vital-signs</option>
              <option value="imaging">imaging</option>
              <option value="labratory">labratory</option>
              <option value="procedure">procedure</option>
              <option value="survey">survey</option>
              <option value="exam">exam</option>
              <option value="therapy">therapy</option>
              <option value="activity">activity</option>
            </select>
          </label>
          <br />
        </div>
        {/*Issue Date*/}
        <div className="p-3 font-mono md:font-mono text-lg/5 md:text-lg/5">
          <label>
            Issue Date:
            <input
              className="rounded border-b-2"
              type="datetime-local"
              name="issueDate"
              required
              defaultValue={new Date().toISOString()}
            />
          </label>
          <br />
        </div>
        {/*Body Site*/}
        <div className="p-3 font-mono md:font-mono text-lg/5 md:text-lg/5">
          <label>
            BodySite:
            <input
              className="rounded border-b-2"
              type="text"
              name="bodySite"
              required
            />
          </label>
          <br />
        </div>
        {/*Interpretation*/}
        <div className="p-3 font-mono md:font-mono text-lg/5 md:text-lg/5">
          <label>
            Interpretation:
            <input
              className="rounded border-b-2"
              type="text"
              name="interpretation"
              required
            />
          </label>
          <br />
        </div>
        {/*Range*/}
        <div className="p-3 font-mono md:font-mono text-lg/5 md:text-lg/5">
          <label>Reference Range:</label>
          <br />
          <div>
            <label>
              Low Value:
              <input className="rounded border-b-2" type="number" name="low" />
            </label>
          </div>
          <div>
            <label>
              High Value:
              <input className="rounded border-b-2" type="number" name="high" />
            </label>
          </div>
          <div>
            <label>
              Unit:
              <input className="rounded border-b-2" type="text" name="unit" />
            </label>
          </div>
        </div>

        {/*Performer*/}
        <div className="p-3 font-mono md:font-mono text-lg/5 md:text-lg/5">
          <label>
            Performer:
            <input
              className="rounded border-b-2"
              type="text"
              name="performer"
            />
          </label>
          <br />
        </div>
        {/*Note*/}
        <div className="p-3 font-mono md:font-mono text-lg/5 md:text-lg/5">
          <label>
            Note:
            <div>
              <textarea
                className="resize border rounded-md"
                name="note"
              ></textarea>
            </div>
          </label>
          <br />
        </div>
        {/*Type of Media */}
        <div className="p-3 font-mono md:font-mono text-lg/5 md:text-lg/5">
          <label>
            Type of Media
            <select className="text-sm" name="typeOfMedia" defaultValue="">
              <option value="" disabled>
                Select type of Media
              </option>
              <option value="image">image</option>
              <option value="video">video</option>
              <option value="audio">audio</option>
            </select>
          </label>
          <br />
        </div>
        {/*File */}
        <div className="p-3 font-mono md:font-mono text-lg/5 md:text-lg/5">
          <label>
            Media:
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              multiple
            />
          </label>
          <br />
        </div>
        {/* Status of the Media */}
        <div className="p-3 font-mono md:font-mono text-lg/5 md:text-lg/5">
          <label>
            Status Media:
            <select className="text-sm" name="statusMedia" defaultValue="">
              <option value="" disabled>
                Select Status
              </option>
              <option value="preparation">preparation</option>
              <option value="in-progress">in-progress</option>
              <option value="not-done">not-done</option>
              <option value="on-hold">on-hold</option>
              <option value="stopped">stopped</option>
              <option value="completed">completed</option>
              <option value="entered-in-error">entered-in-error</option>
              <option value="unknown">unknown</option>
            </select>
          </label>
          <br />
        </div>

        <div className="justify-center flex-2">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded object-center text-lg "
            type="submit"
          >
            Submit
          </button>
        </div>

        <SubmissionStatus
          submissionStatus={submissionStatus}
          submissionTextSuccess={
            "Observation was successfully added to the Database."
          }
          submissionHeadlineSuccess={"Submission successful!"}
          submissionHeadlineFailure={"Submission failed. Please try again."}
          submissionTextFailure={
            "Observation could not be successfully added to the Database."
          }
        ></SubmissionStatus>
      </form>
    </div>
  );
};

export default ObservationInput;
