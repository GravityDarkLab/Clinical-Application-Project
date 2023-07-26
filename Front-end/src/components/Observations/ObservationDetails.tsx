import { useState, useEffect, FormEvent } from "react";
import { useParams } from "react-router-dom";
import { fhirR4 } from "@smile-cdr/fhirts";
import { RenderObservations } from "../Utils/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faSave, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import EditObservationForm from "./EditObservationForm";
import BundleEntry from "../Utils/BundleEntry";
import { useAuth0 } from "@auth0/auth0-react";
import Banner from "../elements/Banner";

const ObservationDetails = () => {
  const { observationId } = useParams();
  const [observation, setObservation] = useState<fhirR4.Observation>();
  const [media, setMedia] = useState<fhirR4.Media[]>([]);
  const { getAccessTokenSilently } = useAuth0();
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedObservation, setEditedObservation] =
    useState<fhirR4.Observation>({} as fhirR4.Observation);

  const navigate = useNavigate();

  useEffect(() => {
    fetchObservation();
  }, [observationId, getAccessTokenSilently]);

  /**
   * Fetches the Observation data and associated Media based on the given observationId.
   */
  const fetchObservation = async () => {
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(
        `http://localhost:8080/fhir/Observation/${observationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Check if the fetch request was successful
      if (response.ok) {
        // Parse the response JSON to get the Observation data
        const observationData = await response.json();

        // Set the Observation state
        setObservation(observationData);

        // Create an array to store the associated Media
        const mediaArray: fhirR4.Media[] = [];

        // Check if the Observation has derivedFrom references
        if (observationData && observationData.derivedFrom) {
          // Iterate over each derivedFrom reference
          for (const derivedFrom of observationData.derivedFrom) {
            try {
              // Fetch the Media data based on the derivedFrom identifier
              const responseMedia = await fetch(
                `http://localhost:8080/fhir/Media?identifier=${derivedFrom.identifier?.value}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              // Check if the fetch request for Media was successful
              if (responseMedia.ok) {
                // Parse the response JSON to get the Media data
                const dataMedia = await responseMedia.json();

                // Get the first Media resource from the response
                const mediaData = dataMedia.entry.map(
                  (entry: BundleEntry) => entry.resource
                );

                // Add the Media to the array if it exists
                if (mediaData.length > 0) {
                  mediaArray.push(mediaData[0]);
                }
              } else {
                console.error("Failed to fetch Media:", responseMedia.status);
              }
            } catch (error) {
              console.error("Error fetching Media:", error);
            }
          }
        }

        // Set the Media state
        setMedia(mediaArray);
      } else {
        console.error("Failed to fetch Observation:", response.status);
      }
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
      const token = await getAccessTokenSilently();
      const response = await fetch(
        `http://localhost:8080/fhir/Observation/${observationId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
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

  /**
   * Function to handle the deletion of an Observation and its associated Media.
   */
  const handleDelete = async () => {
    try {
      const token = await getAccessTokenSilently();

      // Fetch the Observation first
      const response = await fetch(
        `http://localhost:8080/fhir/Observation/${observationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Check if the fetch request for Observation was successful
      if (!response.ok) {
        console.error("Failed to fetch Observation:", response.status);
        return;
      }

      // Parse the response JSON to get the Observation data
      const observationData = await response.json();

      // Delete the associated Media (derivedFrom) if it exists
      if (observationData && observationData.derivedFrom) {
        // Iterate over each derivedFrom reference
        for (const derivedFrom of observationData.derivedFrom) {
          try {
            // Delete the Media based on the derivedFrom reference
            await fetch(
              `http://localhost:8080/fhir/Media/${derivedFrom.reference}`,
              {
                method: "DELETE",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
          } catch (error) {
            console.error("Error deleting Media:", error);
          }
        }
      }

      // Delete the Observation
      const deleteResponse = await fetch(
        `http://localhost:8080/fhir/Observation/${observationId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Check if the delete request for Observation was successful
      if (!deleteResponse.ok) {
        console.error("Failed to delete Observation:", deleteResponse.status);
        return;
      }

      // Navigate to the desired page after successful deletion
      navigate(-1);
    } catch (error) {
      console.error("Error deleting Observation:", error);
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
          {<RenderObservations media={media}></RenderObservations>}
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
      <Banner>{"Observation " + observation?.id}</Banner>
      <div className="flex justify-center">{renderObservationDetails()}</div>
    </div>
  );
};

export default ObservationDetails;
