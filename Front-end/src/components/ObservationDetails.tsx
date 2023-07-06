import { useState, useEffect, FormEvent } from "react";
import { useParams } from "react-router-dom";
import { fhirR4 } from "@smile-cdr/fhirts";
import { RenderObservationPhotos } from "./utils";
import HomeButton from "./HomeButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faSave, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import EditObservationForm from "./EditObservationForm";
import BundleEntry from "./BundleEntry";

const ObservationDetails = () => {
  const { observationId } = useParams();
  const [observation, setObservation] = useState<fhirR4.Observation>();
  const [media, setMedia] = useState<fhirR4.Media[]>([]);

  const [isEditMode, setIsEditMode] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [editedObservation, setEditedObservation] =
    useState<fhirR4.Observation>({} as fhirR4.Observation);

  const navigate = useNavigate();

  useEffect(() => {
    fetchObservation();
  }, [observationId]);

  const fetchObservation = async () => {
    try {
      console.log(`http://localhost:8080/fhir/Observation/${observationId}`);
      const response = await fetch(
        `http://localhost:8080/fhir/Observation/${observationId}`
      );
      const observationData = await response.json();

      console.log(observationData);
      setObservation(observationData);

      const media_array: fhirR4.Media[] = [];

      if (observationData) {
        const array_derivedFrom = observationData.derivedFrom;

        console.log(array_derivedFrom);
        if (array_derivedFrom) {
          for (let i = 0; i < array_derivedFrom.length; ++i) {
            try {
              const responseMedia = await fetch(
                `http://localhost:8080/fhir/Media?identifier=${array_derivedFrom[i].identifier?.value}`
              );

              const dataMedia = await responseMedia.json();
              const mediaData = dataMedia.entry.map(
                (entry: BundleEntry) => entry.resource
              );

              media_array.push(mediaData[0]);
              console.log(mediaData);
            } catch (error) {
              console.error("Error fetching Media:", error);
            }
          }
        }
      }

      console.log(media_array);
      setMedia(media_array);
    } catch (error) {
      console.error("Error fetching Observation:", error);
    }
  };

  // Function to handle the edit button click

  const handleEdit = () => {
    setIsEditMode(true);
    if (observation) {
      setEditedObservation(observation);
    }
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
  };

  // Function to handle the SAVE

  const handleSave = async (
    event: FormEvent,
    editedObservation: fhirR4.Observation
  ) => {
    event.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:8080/fhir/Observation/${observationId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editedObservation),
        }
      );
      if (response.ok) {
        setObservation(editedObservation);
        console.log(response);
        setIsEditMode(false);
      } else {
        console.error("Failed to save patient data");
      }
    } catch (error) {
      console.error("Error saving patient data:", error);
    }
  };

  // Function to handle DELETE

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/fhir/Observation/${observationId}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        navigate(`/patient`);
      } else {
        console.error("Failed to delete patient");
      }
    } catch (error) {
      console.error("Error deleting patient:", error);
    }
  };

  // Render patient details
  const renderObservationDetails = () => {
    if (!observation) {
      return <p className="text-gray-500 text-lg">Loading...</p>;
    }

    if (isEditMode) {
      return (
        <EditObservationForm
          observation={observation}
          media={media}
          onSave={handleSave}
          onCancel={handleCancelEdit}
        />
      );
    }

    return (
      <div className="max-w-md mx-auto p-4 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Observation Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm mb-2">
              <span className="font-semibold">ID:</span> {observation.id}
            </p>
            <p className="text-sm mb-2">
              <span className="font-semibold">Identifier:</span>{" "}
              {observation.identifier?.[0]?.value}
            </p>
            <p className="text-sm mb-2">
              <span className="font-semibold">Status:</span>{" "}
              {observation.status}
            </p>
            <p className="text-sm mb-2">
              <span className="font-semibold">Category</span>
              {observation.category?.[0]?.coding?.[0]?.code}
            </p>
            <p className="text-sm mb-2">
              <span className="font-semibold">Date:</span>{" "}
              {observation.effectiveDateTime}
            </p>
          </div>
          <div>
            <p className="text-sm mb-2">
              <span className="font-semibold">Note:</span>{" "}
              {observation.note?.[0]?.text === undefined ? (
                <span className="text-gray-400">None</span>
              ) : (
                observation.note?.[0]?.text
              )}
            </p>
          </div>
        </div>
        <div className="mt-4">
          <span className="font-semibold">Attachments:</span>{" "}
          <RenderObservationPhotos media={media}></RenderObservationPhotos>
        </div>
        {
          <div className="flex justify-center mt-4">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleEdit}
            >
              <FontAwesomeIcon icon={faEdit} className="mr-2" />
              Edit
            </button>
            <button
              className="ml-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleDelete}
            >
              <FontAwesomeIcon icon={faTrash} className="mr-2" />
              Delete
            </button>
          </div>
        }
      </div>
    );
  };

  return (
    <div>
      <div>
        <HomeButton />
      </div>
      <div className="flex justify-center h-auto p-10 bg-sky-800 text-4xl text-white mb-10 overflow-x-auto">
        <div className="max-w-full md:max-w-[80%] lg:max-w-[70%]">
          {"Observation " + observation?.id}
        </div>
      </div>
      <div className="flex justify-center">{renderObservationDetails()}</div>
    </div>
  );
};

export default ObservationDetails;
