import React, { useState } from "react";
import { fhirR4 } from "@smile-cdr/fhirts";
import { v4 as uuidv4 } from "uuid";
import SubmissionStatus from "../elements/SubmissonStatus";
import { post } from "../Utils/utils";
import { useAuth0 } from "@auth0/auth0-react";
import Banner from "../elements/Banner";
import { FormField } from "../Utils/formComponents";

const PatientForm: React.FC = () => {
  // State variables
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [submissionStatus, setSubmissionStatus] = useState<
    "success" | "failure" | null
  >(null);
  const { getAccessTokenSilently } = useAuth0();

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

    const submitPatientData = async (patientData: fhirR4.Patient) => {
      const token = await getAccessTokenSilently();

      try {
        await post("Patient", patientData, token, setSubmissionStatus);
        setSubmissionStatus("success");
      } catch (error) {
        setSubmissionStatus("failure");
      }
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
      <Banner>Enter new Patient</Banner>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="max-w-7xl mx-auto">
          <form
            className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3"
            onSubmit={handleSubmit}
          >
            <FormField
              label="Given Name"
              name="givenName"
              type="text"
              required
            />
            <FormField label="Family Name" name="family" type="text" required />
            <FormField
              label="Title"
              name="title"
              type="select"
              options={[
                { label: "Select Title", value: "", disabled: true },
                { label: "Dr.", value: "Dr." },
                { label: "Prof.", value: "Prof." },
                { label: "None", value: "" },
              ]}
            />
            <FormField
              label="Identifier"
              name="identifier"
              type="text"
              required
            />
            <FormField
              label="Gender"
              name="gender"
              type="select"
              required
              options={[
                { label: "Male", value: "male" },
                { label: "Female", value: "female" },
                { label: "Other", value: "other" },
              ]}
            />
            <FormField label="Birthday" name="birthday" type="date" required />
            <FormField label="Email" name="email" type="email" required />
            <FormField label="Phone" name="phone" type="tel" required />
            <FormField
              label="Street and Number"
              name="street_number"
              type="text"
              required
            />
            <FormField label="City" name="city" type="text" required />
            <FormField
              label="Postal Code"
              name="postalCode"
              type="text"
              required
            />
            <FormField label="State" name="state" type="text" required />
            <FormField label="Country" name="country" type="text" required />
            <FormField
              label="Marital Status"
              name="maritalStatus"
              type="select"
              options={[
                { label: "Single", value: "S" },
                { label: "Divorced", value: "F" },
                { label: "Married", value: "M" },
                { label: "Widowed", value: "W" },
                { label: "Polygamous", value: "P" },
                { label: "Unknown", value: "unknown" },
              ]}
            />
            <FormField
              label="Language"
              name="language"
              type="select"
              required
              options={[
                { label: "German", value: "de" },
                { label: "English", value: "en" },
                { label: "French", value: "fr" },
                { label: "Spanish", value: "es" },
                { label: "Italian", value: "it" },
                { label: "Dutch", value: "nl" },
                { label: "Norwegian", value: "no" },
                { label: "Portuguese", value: "pt" },
                { label: "Russian", value: "ru" },
                { label: "Arabic", value: "ar" },
              ]}
            />
            <FormField
              label="Photo"
              name="photo"
              type="file"
              handler={handlePhotoChange}
            />
            <FormField label="Active" name="active" type="checkbox" />
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
              submissionTextSuccess="Patient was successfully added to the Database."
              submissionHeadlineSuccess="Submission successful!"
              submissionHeadlineFailure="Submission failed. Please try again."
              submissionTextFailure="Patient could not be successfully added to the Database."
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default PatientForm;
