import React, { ChangeEvent, FormEvent, useState } from "react";
import { fhirR4 } from "@smile-cdr/fhirts";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface EditPatientFormProps {
  patient: fhirR4.Patient;
  onSave: (event: FormEvent, editedPatient: fhirR4.Patient) => Promise<void>;
  onCancel: () => void;
}

// `EditPatientForm` is a form for editing patient data.
// It takes the current patient data, a save handler, and a cancel handler as props.
const EditPatientForm: React.FC<EditPatientFormProps> = ({
  patient,
  onSave,
  onCancel,
}) => {
  // State for the edited patient data, initially set to the current patient data
  const [editedPatient, setEditedPatient] = useState<fhirR4.Patient>(patient);
  // State for a photo file, initially set to null
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  // Handler for input change events
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    // Extract the name and value from the event target (input field)
    const { name, value, files } = e.target;
    // Handle BirthDate field differently
    if (name === "birthdate") {
      setEditedPatient((prevPatient) => ({
        ...prevPatient,
        birthDate: value,
      }));
      // Handle phone and email fields
    } else if (name === "phone" || name === "email") {
      setEditedPatient((prevPatient) => {
        const updatedPatient = { ...prevPatient };
        // Get the telecom array or initialize it as an empty array if undefined
        const telecom = updatedPatient.telecom || [];
        // Find the index of the contact point with the same system as the name
        const contactPointIndex = telecom.findIndex(
          (contactPoint) => contactPoint.system === name
        );
        // If an existing contact point is found, update its value
        if (contactPointIndex !== -1) {
          telecom[contactPointIndex].value = value;
          // If no existing contact point is found, add a new contact point
        } else {
          telecom.push({ system: name, value: value });
        }
        // Update the telecom array in the updatedPatient object
        updatedPatient.telecom = telecom;

        return updatedPatient;
      });
    } else if (name === "photo" && files && files.length > 0) {
      // If a new photo file was provided, update photoFile state
      const file = files[0];
      setPhotoFile(file);
    } else if (name === "given") {
      
      setEditedPatient((prevPatient) => {
        const updatedPatient = { ...prevPatient };

        const newHumanName = new fhirR4.HumanName();
        newHumanName.prefix = (updatedPatient.name !== undefined && updatedPatient.name[0] !== undefined && updatedPatient.name[0].prefix !== undefined ? updatedPatient.name[0].prefix : []);

        newHumanName.family = (updatedPatient.name !== undefined && updatedPatient.name[0] !== undefined && updatedPatient.name[0].family !== undefined ? updatedPatient.name[0].family : "");

        newHumanName.given = (updatedPatient.name !== undefined && updatedPatient.name[0] !== undefined && updatedPatient.name[0].prefix !== undefined ? [value] : []);

        updatedPatient.name = [newHumanName];

        return updatedPatient;
      });

    } else if (name === "family") {

      setEditedPatient((prevPatient) => {
        const updatedPatient = { ...prevPatient };

        const newHumanName = new fhirR4.HumanName();
        newHumanName.prefix = (updatedPatient.name !== undefined && updatedPatient.name[0] !== undefined && updatedPatient.name[0].prefix !== undefined ? updatedPatient.name[0].prefix : []);

        newHumanName.family = (updatedPatient.name !== undefined && updatedPatient.name[0] !== undefined && updatedPatient.name[0].family !== undefined ? value : "");

        newHumanName.given = (updatedPatient.name !== undefined && updatedPatient.name[0] !== undefined && updatedPatient.name[0].prefix !== undefined ? updatedPatient.name[0].given : []);

        updatedPatient.name = [newHumanName];

        return updatedPatient;
      });

    } else {
      // For other fields, update the corresponding field in the editedPatient object
      setEditedPatient((prevPatient) => ({
        ...prevPatient,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    // Copy the edited patient data
    const patientData = { ...editedPatient };
    // If a new photo file was provided
    if (photoFile) {
      // Initialize a new photo attachment with the file's MIME type and the old photo's ID
      const photoAttachment: fhirR4.Attachment = {
        contentType: photoFile.type,
        data: "",
        id: patient.photo?.[0].id,
      };
      // Create a new FileReader to read the file data
      const reader = new FileReader();
      // Once the file is read
      reader.onload = () => {
        // If the result is a string (as expected)
        if (typeof reader.result === "string") {
          // Extract the Base64-encoded data from the result
          photoAttachment.data = reader.result.split(",")[1] || "";
          // Update the patient data's photo with the new attachment
          patientData.photo = [photoAttachment];
          // Call the save handler with the updated patient data
          onSave(e, patientData);
        }
      };
      reader.readAsDataURL(photoFile);
    } else {
      // If no new photo file was provided, call the save handler with the patient data as is
      onSave(e, patientData);
    }
  };
  // The component renders a form with inputs for various patient data fields
  // On submit, it calls the handleSubmit function
  // On input change, it calls the handleInputChange function
  // The Cancel button calls the onCancel function when clicked
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Edit Patient</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="givenName" className="text-lg font-medium">
            Given Name:
          </label>
          <input
            type="text"
            id="givenName"
            name="given"
            value={editedPatient.name?.[0]?.given || ""}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="familyName" className="text-lg font-medium">
            Family Name:
          </label>
          <input
            type="text"
            id="familyName"
            name="family"
            value={editedPatient.name?.[0]?.family || ""}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="birthdate" className="text-lg font-medium">
            Date of Birth:
          </label>
          <input
            type="date"
            id="birthdate"
            name="birthdate"
            value={editedPatient.birthDate || ""}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="phone" className="text-lg font-medium">
            Phone:
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={editedPatient.telecom?.[0]?.value || ""}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="text-lg font-medium">
            E-Mail:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={editedPatient.telecom?.[1]?.value || ""}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="photo" className="text-lg font-medium">
            Photo:
          </label>
          <input
            type="file"
            id="photo"
            name="photo"
            accept="image/*"
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        {/* Add more fields as needed */}
        <div className="flex justify-center mt-6">
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
          >
            <FontAwesomeIcon icon={faSave} className="mr-2" />
            Save
          </button>
          <button
            type="button"
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={onCancel}
          >
            {/*<FontAwesomeIcon icon={faCancel} className="mr-2" />*/}
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPatientForm;
