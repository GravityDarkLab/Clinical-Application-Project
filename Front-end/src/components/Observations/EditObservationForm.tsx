import React, { ChangeEvent, FormEvent, useState } from "react";
import { fhirR4 } from "@smile-cdr/fhirts";
import { faSave, faBan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface EditObservationFormProps {
  observation: fhirR4.Observation;
  media: fhirR4.Media[];
  onSave: (
    event: FormEvent,
    editedObservation: fhirR4.Observation,
    editedMedia: fhirR4.Media[]
  ) => Promise<void>;
  onCancel: () => void;
}

/**
 * EditObservationForm is a React Functional Component that provides a form for editing an observation.
 * It uses two pieces of local state: editedObservation and editedMedia.
 * It has two handlers: one for input changes and one for form submission.
 * It takes the following props:
 * observation - the initial observation to be edited
 * media - the associated media to be edited
 * onSave - function to be called on form submission
 * onCancel - function to be called when the form is cancelled
 * @component
 * @param {EditObservationFormProps} {observation, media, onSave, onCancel}
 */
const EditObservationForm: React.FC<EditObservationFormProps> = ({
  observation,
  media,
  onSave,
  onCancel,
}) => {
  const [editedObservation, setEditedObservation] =
    useState<fhirR4.Observation>(observation);
  const [editedMedia, setEditedMedia] = useState<fhirR4.Media[]>(media);
  /**
   * Function to handle input change and set the state of the edited observation
   * It handles special cases for identifier, status, category and date fields
   * For other fields, it sets their values directly.
   * @function handleInputChange
   * @param {ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>} e - The input change event
   */
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;

    if (name === "identifier") {
      const newIdentifier = new fhirR4.Identifier();
      newIdentifier.value = value;

      setEditedObservation((prevObservation) => ({
        ...prevObservation,
        identifier: [newIdentifier],
      }));
    } else if (name === "status") {
      const statusValue: fhirR4.Observation.StatusEnum | undefined =
        value === "registered" || value === "preliminary" || value === "final"
          ? (value as fhirR4.Observation.StatusEnum)
          : "preliminary";
      setEditedObservation((prevObservation) => ({
        ...prevObservation,
        status: statusValue,
      }));
    } else if (name === "category") {
      const observationCategory = new fhirR4.CodeableConcept();
      const newCategoryCoding = new fhirR4.Coding();
      newCategoryCoding.system =
        "http://hl7.org/fhir/ValueSet/observation-category";
      newCategoryCoding.code = value;
      observationCategory.coding = [newCategoryCoding];

      setEditedObservation((prevObservation) => ({
        ...prevObservation,
        category: [observationCategory],
      }));
    } else if (name === "date") {
      setEditedObservation((prevObservation) => ({
        ...prevObservation,
        effectiveDateTime: value,
      }));
    } else {
      setEditedObservation((prevObservation) => ({
        ...prevObservation,
        [name]: value,
      }));
    }
  };
  /**
   * Function to handle form submission
   * It prevents the default form submission event and calls the onSave function with the edited observation and media
   * @function handleSubmit
   * @param {FormEvent<HTMLFormElement>} e - The form event
   * @returns {Promise<void>}
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    await onSave(e, editedObservation, editedMedia);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Edit Observation</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="identifier" className="text-lg font-medium">
            Identifier:
          </label>
          <input
            type="text"
            id="identifier"
            name="identifier"
            value={editedObservation.identifier?.[0]?.value || ""}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="status" className="text-lg font-medium">
            Status:
          </label>
          <select
            id="status"
            name="status"
            value={editedObservation.status}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="" disabled>
              Select Status
            </option>
            <option value="registered">registered</option>
            <option value="preliminary">preliminary</option>
            <option value="final">final</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="category" className="text-lg font-medium">
            Category:
          </label>
          <select
            id="category"
            name="category"
            value={editedObservation.category?.[0]?.coding?.[0]?.code || ""}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
        </div>

        <div className="mb-4">
          <label htmlFor="date" className="text-lg font-medium">
            Date:
          </label>
          <input
            type="datetime"
            id="date"
            name="date"
            value={editedObservation.effectiveDateTime || ""}
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
            <FontAwesomeIcon icon={faBan} className="mr-2" />
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditObservationForm;
