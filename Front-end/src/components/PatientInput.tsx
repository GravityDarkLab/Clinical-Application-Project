import React, { useState } from "react";
import { fhirR4 } from "@smile-cdr/fhirts";
import { v4 as uuidv4 } from "uuid";
import HomeButton from "./HomeButton";
import SubmissionStatus from "./SubmissonStatus";
import { post } from "./utils";

const PatientForm: React.FC = () => {
  // State variables
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [submissionStatus, setSubmissionStatus] = useState<string | null>(null);

  /**
   * Handles the form submission event.
   * POST to "http://localhost:8080/fhir/Patient"
   * @param e - The form submission event.
   */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Create a new identifier for the patient
    const newIdentifier = new fhirR4.Identifier();
    newIdentifier.value = // TODO: Use as Krankenversicherungsnummer?
      (
        e.currentTarget.elements.namedItem("identifier") as HTMLInputElement
      ).value;
    // Create a new human name for the patient
    const newHumanName = new fhirR4.HumanName();
    newHumanName.prefix = [
      (e.currentTarget.elements.namedItem("title") as HTMLInputElement).value,
    ];
    newHumanName.family = (
      e.currentTarget.elements.namedItem("family") as HTMLInputElement
    ).value;
    newHumanName.given = [
      (e.currentTarget.elements.namedItem("givenName") as HTMLInputElement)
        .value,
    ];

    // Get the gender value and validate it
    const validGenders = new Set(["male", "female", "other"]);

    const genderValue = (
      e.currentTarget.elements.namedItem("gender") as HTMLInputElement
    ).value;

    const genderVal: fhirR4.Patient.GenderEnum | undefined = validGenders.has(
      genderValue
    )
      ? (genderValue as fhirR4.Patient.GenderEnum)
      : undefined;
    // Construct the birth date in the required format
    const birthDate = (
      e.currentTarget.elements.namedItem("birthday") as HTMLInputElement
    ).value;
    // Create a new contact point for email & PhoneNumber
    const emailValue = (
      e.currentTarget.elements.namedItem("email") as HTMLInputElement
    ).value;
    const phoneValue = (
      e.currentTarget.elements.namedItem("phone") as HTMLInputElement
    ).value;

    const createContactPoint = (
      system: fhirR4.ContactPoint.SystemEnum,
      value: string
    ) => {
      const contactPoint = new fhirR4.ContactPoint();
      contactPoint.system = system;
      contactPoint.value = value;
      return contactPoint;
    };

    const newEmail = createContactPoint("email", emailValue);
    const newPhone = createContactPoint("phone", phoneValue);

    // Create a new address for the patient
    const newAdresss = new fhirR4.Address();
    newAdresss.line = [
      (e.currentTarget.elements.namedItem("street_number") as HTMLInputElement)
        .value,
    ];
    newAdresss.city = (
      e.currentTarget.elements.namedItem("city") as HTMLInputElement
    ).value;
    newAdresss.postalCode = (
      e.currentTarget.elements.namedItem("postalCode") as HTMLInputElement
    ).value;
    newAdresss.state = (
      e.currentTarget.elements.namedItem("state") as HTMLInputElement
    ).value;
    newAdresss.country = (
      e.currentTarget.elements.namedItem("country") as HTMLInputElement
    ).value;

    const newMaritalStatus = new fhirR4.CodeableConcept();
    newMaritalStatus.coding = [
      {
        system: "http://hl7.org/fhir/ValueSet/marital-status",
        code:
          (
            e.currentTarget.elements.namedItem(
              "martialStatus"
            ) as HTMLSelectElement
          ).value ?? "",
        display:
          (
            e.currentTarget.elements.namedItem(
              "martialStatus"
            ) as HTMLSelectElement
          ).selectedOptions[0].textContent ?? "",
      },
    ];

    //TODO: Add contact person
    const patientLanguage = new fhirR4.CodeableConcept();
    patientLanguage.coding = [
      {
        system: "urn:ietf:bcp:47",
        code:
          (e.currentTarget.elements.namedItem("language") as HTMLSelectElement)
            .value ?? "",
        display:
          (e.currentTarget.elements.namedItem("language") as HTMLSelectElement)
            .selectedOptions[0].textContent ?? "",
      },
    ];
    const patientCommunication = new fhirR4.PatientCommunication();
    patientCommunication.language = patientLanguage;

    //Create the Patient
    const newPatient: fhirR4.Patient = {
      identifier: [newIdentifier], // An identifier for this patient
      active: (e.currentTarget.elements.namedItem("active") as HTMLInputElement)
        .checked, // Whether this patient's record is in active use
      name: [newHumanName], // Whether this patient's record is in active use
      telecom: [newPhone, newEmail], // A contact detail for the individual
      gender: genderVal, // male | female | other | unknown
      birthDate: birthDate, //The format is YYYY, YYYY-MM, or YYYY-MM-DD
      deceasedBoolean: false,
      deceasedDateTime: "",
      address: [newAdresss],
      maritalStatus: newMaritalStatus,
      multipleBirthBoolean: false,
      multipleBirthInteger: 0,
      photo: [],
      contact: [],
      communication: [patientCommunication],
      resourceType: "Patient",
    };

    const submitPatientData = (patientData: fhirR4.Patient) => {
      post("http://localhost:8080/fhir/Patient", patientData)
        .then((response) => {
          // Handle the response from the API
          console.log("Response from API:", response);
          setSubmissionStatus("success");
        })
        .catch((error) => {
          // Handle any errors that occur during the request
          console.error("Error:", error);
          setSubmissionStatus("failure");
        });
    };

    const handlePhotoUpload = (
      photoFile: File | null,
      patientData: fhirR4.Patient
    ) => {
      if (photoFile) {
        const photoAttachment: fhirR4.Attachment = {
          contentType: photoFile.type,
          data: "",
          id: uuidv4(), // Generate a unique ID for the attachment
        };
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === "string") {
            photoAttachment.data = reader.result.split(",")[1] || "";
            patientData.photo = [photoAttachment];
            // Submit the patient data with the attachment
            submitPatientData(patientData);
          }
        };
        reader.readAsDataURL(photoFile);
      } else {
        // Submit the patient data without the attachment
        submitPatientData(patientData);
      }
    };

    handlePhotoUpload(photoFile, newPatient);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPhotoFile(e.target.files[0]);
    }
  };

  return (
    <div>
      <div>
        <HomeButton />
      </div>
      <div className="flex justify-center p-10 bg-sky-800 text-4xl text-white mb-10">
        Enter new Patient
      </div>
      <form
        className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3"
        onSubmit={handleSubmit}
      >
        <div className="p-3 font-mono md:font-mono text-lg/5 md:text-lg/5">
          <label>
            Given Name:
            <input
              className="rounded border-b-2"
              type="text"
              name="givenName"
              required
            />
          </label>
          <br />
        </div>
        <div className="p-3 font-mono md:font-mono text-lg/5 md:text-lg/5">
          <label>
            Family Name:
            <input
              className="rounded border-b-2"
              type="text"
              name="family"
              required
            />
          </label>
          <br />
        </div>

        <div className="p-3 font-mono md:font-mono text-lg/5 md:text-lg/5">
          <label>
            Title:
            <select className="text-sm" name="title" defaultValue="">
              <option value="" disabled>
                Select Titel
              </option>
              <option value="Dr.">Dr.</option>
              <option value="Prof.">Prof.</option>
              <option value="">None</option>
            </select>
          </label>
          <br />
        </div>

        <div className="p-3 font-mono md:font-mono text-lg/5 md:text-lg/5">
          <label>
            Identifier:
            <input
              className="rounded border-b-2"
              type="text"
              name="identifier"
              required
            />
          </label>
          <br />
        </div>

        <div className="p-3 font-mono md:font-mono text-lg/5 md:text-lg/5">
          <label>
            Gender:
            <select className="rounded border-b-2" name="gender" required>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </label>
          <br />
        </div>

        <div className="p-3 font-mono md:font-mono text-lg/5 md:text-lg/5">
          <label>
            Birthday:
            <input
              className="rounded border-b-2"
              type="date"
              name="birthday"
              required
            />
          </label>
          <br />
        </div>

        <div className="p-3 font-mono md:font-mono text-lg/5 md:text-lg/5">
          <label>
            Email:
            <input
              className="rounded border-b-2"
              type="email"
              name="email"
              required
            />
          </label>
          <br />
        </div>

        <div className="p-3 font-mono md:font-mono text-lg/5 md:text-lg/5">
          <label>
            Phone:
            <input
              className="rounded border-b-2"
              type="tel"
              name="phone"
              required
            />
          </label>
          <br />
        </div>

        <div className="p-3 font-mono md:font-mono text-lg/5 md:text-lg/5">
          <label>
            Street and Number:
            <input
              className="rounded border-b-2"
              type="text"
              name="street_number"
              required
            />
          </label>
          <br />
        </div>

        <div className="p-3 font-mono md:font-mono text-lg/5 md:text-lg/5">
          <label>
            City:
            <input
              className="rounded border-b-2"
              type="text"
              name="city"
              required
            />
          </label>
          <br />
        </div>

        <div className="p-3 font-mono md:font-mono text-lg/5 md:text-lg/5">
          <label>
            Postal Code:
            <input
              className="rounded border-b-2"
              type="text"
              name="postalCode"
              required
            />
          </label>
          <br />
        </div>

        <div className="p-3 font-mono md:font-mono text-lg/5 md:text-lg/5">
          <label>
            State:
            <input
              className="rounded border-b-2"
              type="text"
              name="state"
              required
            />
          </label>
          <br />
        </div>

        <div className="p-3 font-mono md:font-mono text-lg/5 md:text-lg/5">
          <label>
            Country:
            <input
              className="rounded border-b-2"
              type="text"
              name="country"
              required
            />
          </label>
          <br />
        </div>
        <div className="p-3 font-mono md:font-mono text-lg/5 md:text-lg/5">
          <label>
            Martial Status:
            <select className="rounded border-b-2" name="martialStatus">
              <option value="S">Single</option>
              <option value="F">Divorced</option>
              <option value="M">Married</option>
              <option value="W">Widowed</option>
              <option value="P">Polygamous</option>
              <option value="unknown">unknown</option>
            </select>
          </label>
          <br />
        </div>
        <div className="p-3 font-mono md:font-mono text-lg/5 md:text-lg/5">
          <label>
            Language:
            <select className="rounded border-b-2" name="language" required>
              <option value="de">German</option>
              <option value="en">English</option>
              <option value="fr">French</option>
              <option value="es">Spanish</option>
              <option value="it">Italian</option>
              <option value="nl">Dutch</option>
              <option value="no">Norwegian</option>
              <option value="pt">Portuguese</option>
              <option value="ru">Russian</option>
              <option value="ar">Arabic</option>
            </select>
          </label>
          <br />
        </div>
        <div className="p-3 font-mono md:font-mono text-lg/5 md:text-lg/5">
          <label>
            Photo:
            <input type="file" accept="image/*" onChange={handlePhotoChange} />
          </label>
          <br />
        </div>

        <div className="p-3 font-mono md:font-mono text-lg/5 md:text-lg/5">
          <label>
            Active:
            <input
              className="rounded border-b-2"
              type="checkbox"
              name="active"
              defaultChecked
            />
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
          submissionTextSucess={
            "Patient was successfully added to the Database."
          }
          submissionHeadlineSucess={"Submission successful!"}
          submissionHeadlineFailure={"Submission failed. Please try again."}
          submissionTextFailure={
            "Patient could not be successfully added to the Database."
          }
        ></SubmissionStatus>
      </form>
    </div>
  );
};

export default PatientForm;
