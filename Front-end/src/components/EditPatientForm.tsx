import React, { ChangeEvent, FormEvent, useState } from "react";
import { fhirR4 } from "@smile-cdr/fhirts";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface EditPatientFormProps {
  patient: fhirR4.Patient;
  onSave: (event: FormEvent, editedPatient: fhirR4.Patient) => Promise<void>;
  onCancel: () => void;
}

const EditPatientForm: React.FC<EditPatientFormProps> = ({
  patient,
  onSave,
  onCancel,
}) => {
  const [editedPatient, setEditedPatient] = useState<fhirR4.Patient>(patient);

  //TODO: Upgrade

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    // Extract the name and value from the event target (input field)
    const { name, value } = e.target;
    if (name === "birthdate") {
      // Handle BirthDate field differently
      setEditedPatient((prevPatient) => ({
        ...prevPatient,
        birthDate: value,
      }));
    } else {
      // Update the editedPatient state
      setEditedPatient((prevPatient) => ({
        // Create a new object with the same properties as prevPatient
        ...prevPatient,
        // Update the name property with the new value
        name: [
          // Create a new name array with the updated value
          {
            // Copy the existing name object or create a new one if it doesn't exist
            ...prevPatient.name?.[0],
            // Update the specific field (identified by the name) with the new value
            [name]: value,
          },
        ],
      }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    await onSave(e, editedPatient);
  };

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
