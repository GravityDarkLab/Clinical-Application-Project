import { fhirR4 } from "@smile-cdr/fhirts";
import { useState } from "react";
import {
  faArrowAltCircleLeft,
  faArrowAltCircleRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/**
 * Filters an array of resources based on the specified filter attribute and search text.
 *
 * @param resources - The array of resources to be filtered.
 * @param filterAttribute - The attribute to filter by.
 * @param searchText - The text to search for.
 * @returns The filtered array of resources.
 */
export function filterResources<T>(
  resources: T[],
  filterAttribute: string,
  searchText: string
): T[] {
  const filteredResources = resources.filter((resource: any) => {
    if (filterAttribute === "identifier") {
      return resource.identifier?.[0]?.value
        ?.toString()
        .toLowerCase()
        .includes(searchText.toLowerCase());
    } else if (filterAttribute === "status") {
      return resource.status?.toLowerCase().includes(searchText.toLowerCase());
    } else if (filterAttribute === "code") {
      return resource.code?.coding?.[0]?.code
        ?.toLowerCase()
        .includes(searchText.toLowerCase());
    } else if (filterAttribute === "dateTime") {
      return resource.effectiveDateTime
        ?.toString()
        .toLowerCase()
        .includes(searchText.toLowerCase());
    } else if (filterAttribute === "bodySite") {
      return resource.bodySite?.coding?.[0]?.code
        ?.toString()
        .toLowerCase()
        .includes(searchText.toLowerCase());
    } else if (filterAttribute === "name") {
      return resource.name?.[0]?.given?.[0]
        .toLowerCase()
        .includes(searchText.toLowerCase());
    } else if (filterAttribute === "family") {
      return resource.name?.[0].family
        ?.toLowerCase()
        .includes(searchText.toLowerCase());
    } else if (filterAttribute === "birthDate") {
      return resource.birthDate
        ?.toLowerCase()
        .includes(searchText.toLowerCase());
    } else {
      return null;
    }
  });

  return filteredResources;
}

/**
 * Sorts an array of resources based on the specified sort attribute.
 *
 * @param resources - The array of resources to be sorted.
 * @param sortAttribute - The attribute to sort by.
 * @returns The sorted array of resources.
 */
export const sortResources = <T extends { [key: string]: any }>(
  resources: T[],
  sortAttribute: string
) => {
  const getValue = (resource: T) => {
    switch (sortAttribute) {
      case "identifier":
        return resource.identifier?.[0]?.value;
      case "status":
        return resource.status;
      case "code":
        return resource.code?.coding?.[0]?.code;
      case "dateTime":
        return resource.effectiveDateTime;
      case "bodySite":
        return resource.bodySite?.coding?.[0]?.code;
      case "name":
        return resource.name?.[0]?.given?.[0];
      case "family":
        return resource.name?.[0]?.family;
      case "birthDate":
        return resource.birthDate;
      default:
        return undefined;
    }
  };

  return resources.sort((resourceOne: T, resourceTwo: T) => {
    const valueOne = getValue(resourceOne);
    const valueTwo = getValue(resourceTwo);

    if (valueOne === undefined || valueTwo === undefined) {
      return 0;
    }

    return valueOne.localeCompare(valueTwo);
  });
};

/**
 * Renders the patient photos and provides an interactive display.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {fhirR4.Patient} props.patient - The patient object containing photo information.
 * @returns {JSX.Element} - The rendered component.
 */

const RenderPatientPhotos = ({ patient }: { patient: fhirR4.Patient }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<fhirR4.Attachment | null>(
    null
  );

  const handlePhotoClick = (photo: fhirR4.Attachment) => {
    setSelectedPhoto(photo);
  };

  if (!patient.photo || patient.photo.length === 0) {
    return <span className="text-gray-400">No attachment available</span>;
  }

  return (
    <div className="flex flex-wrap">
      {patient.photo.map((photo) => (
        <div
          key={photo.id}
          className="w-50 h-50 bg-gray-400 rounded-lg overflow-hidden mx-1 my-1 cursor-pointer"
          onClick={() => handlePhotoClick(photo)}
        >
          <img
            src={getCachedPhotoUrl(photo)}
            alt="Patient Attachment"
            className="object-cover w-full h-full"
          />
        </div>
      ))}
      {selectedPhoto && (
        <div
          className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-75 z-50"
          onClick={() => setSelectedPhoto(null)}
        >
          <img
            src={getCachedPhotoUrl(selectedPhoto)}
            alt="Latest observation"
            className="max-w-full max-h-full"
          />
        </div>
      )}
    </div>
  );
};

/**
 * Renders the patient photos and provides an interactive display.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {fhirR4.Patient} props.patient - The patient object containing photo information.
 * @returns {JSX.Element} - The rendered component.
 */

const RenderObservationPhoto = ({ media }: { media: fhirR4.Media }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<fhirR4.Attachment | null>(
    null
  );

  const handlePhotoClick = (photo: fhirR4.Attachment) => {
    setSelectedPhoto(photo);
  };

  return (
    <div className="flex flex-wrap">
      <div
        key={media.id}
        className="w-50 h-50 bg-gray-400 rounded-lg overflow-hidden mx-1 my-1 cursor-pointer"
        onClick={() => handlePhotoClick(media.content)}
      >
        <img
          src={getCachedPhotoUrl(media.content)}
          alt="Patient Attachment"
          className="object-cover w-full h-full"
        />
      </div>

      {selectedPhoto && (
        <div
          className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-75 z-50"
          onClick={() => setSelectedPhoto(null)}
        >
          <img
            src={getCachedPhotoUrl(selectedPhoto)}
            alt="Latest observation"
            className="max-w-full max-h-full"
          />
        </div>
      )}
    </div>
  );
};

/**
 * Renders the patient photos.
 *
 * @param {fhirR4.Patient} patient - The patient object containing photo information.
 * @returns {JSX.Element | string} - JSX element representing the patient photos or a string indicating no attachment available.
 */
export const RenderObservationPhotos = ({
  media,
}: {
  media: fhirR4.Media[];
}) => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(0);

  const handlePreviousClick = () => {
    setSelectedPhotoIndex((prevIndex) =>
      prevIndex === 0 ? media.length - 1 : prevIndex - 1
    );
  };

  const handleNextClick = () => {
    setSelectedPhotoIndex((prevIndex) =>
      prevIndex === media.length - 1 ? 0 : prevIndex + 1
    );
  };

  console.log(media);
  if (!media || media.length === 0) {
    return <div>No attachment available</div>;
  }
  return (
    <div>
      <RenderObservationPhoto media={media[selectedPhotoIndex]} />
      <div className="flex justify-between w-full">
        <button onClick={handlePreviousClick}>
          <FontAwesomeIcon
            icon={faArrowAltCircleLeft}
            className="text-4xl bg-blue-500 rounded-full text-white"
          />
        </button>
        <button onClick={handleNextClick}>
          <FontAwesomeIcon
            icon={faArrowAltCircleRight}
            className="text-4xl bg-blue-500 rounded-full text-white"
          />
        </button>
      </div>
    </div>
  );
};

/**
 * Renders the patient photos.
 *
 * @param {fhirR4.Patient} patient - The patient object containing photo information.
 * @returns {JSX.Element | string} - JSX element representing the patient photos or a string indicating no attachment available.
 */

export const renderPatientPhotos = (patient: fhirR4.Patient) => {
  if (!patient.photo || patient.photo.length === 0) {
    return "No attachment available";
  }
  return <RenderPatientPhotos patient={patient} />;
};
/**
 * Gets the cached photo URL or creates a new cache entry.
 *
 * @param {fhirR4.Attachment} photo - The photo object containing data and content type.
 * @returns {string} - The URL of the cached photo or an empty string if not available.
 */

const getCachedPhotoUrl = (photo: fhirR4.Attachment) => {
  if (!photo || !photo.data) return "";

  const cacheKey = `${photo.id}-${photo.data}`;
  const cachedImage = localStorage.getItem(cacheKey);

  if (cachedImage) {
    return cachedImage;
  } else {
    const image = `data:${photo.contentType};base64,${photo.data}`;
    localStorage.setItem(cacheKey, image);
    return image;
  }
};

/**
 * Generates the patient address element based on the address data.
 *
 * @param patient - The FHIR R4 Patient resource.
 * @returns The address element in a table cell (<td>) format.
 */
export const generatePatientAddress = (patient: fhirR4.Patient) => {
  if (patient.address && patient.address.length > 0) {
    const firstAddress = patient.address[0];
    if (firstAddress.text) {
      // Address is stored as a single text value
      return firstAddress.text;
    } else if (
      firstAddress.line &&
      firstAddress.city &&
      firstAddress.state &&
      firstAddress.postalCode
    ) {
      // Address is stored separately with line, city, state, and postalCode properties
      const { line, city, state, postalCode } = firstAddress;
      const addressString = `${line.join(
        ", "
      )} ${city}, ${state} ${postalCode}`;
      return addressString;
    }
  }
  return "No address available";
};

/*
 * POST
 */

export const post = async (url: string, data: any) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      return await response.json();
    } else {
      throw new Error("Request failed");
    }
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

/**
 * @deprecated Use `filterResources` instead.
 */
export const filterPatients = (
  patients: fhirR4.Patient[],
  filterAttribute: string,
  searchText: string
) => {
  const filteredPatients = patients.filter((patient) => {
    if (filterAttribute === "name") {
      return patient.name?.[0]?.given?.[0]
        .toLowerCase()
        .includes(searchText.toLowerCase());
    } else if (filterAttribute === "family") {
      return patient.name?.[0].family
        ?.toLowerCase()
        .includes(searchText.toLowerCase());
    } else if (filterAttribute === "birthDate") {
      return patient.birthDate
        ?.toLowerCase()
        .includes(searchText.toLowerCase());
    } else if (filterAttribute === "identifier") {
      return patient.identifier?.[0].value
        ?.toString()
        .toLowerCase()
        .includes(searchText.toLowerCase());
    } else {
      return null;
    }
  });
  return filteredPatients;
};

/**
 * @deprecated Use `filterResources` instead.
 */
export const filterObservation = (
  observations: fhirR4.Observation[],
  filterAttribute: string,
  searchText: string
) => {
  const filteredMedia = observations.filter((observation) => {
    if (filterAttribute === "identifier") {
      return observation.identifier?.[0]?.value
        ?.toLowerCase()
        .includes(searchText.toLowerCase());
    } else if (filterAttribute === "status") {
      return observation.status
        ?.toLowerCase()
        .includes(searchText.toLowerCase());
    } else if (filterAttribute === "code") {
      return observation.code?.coding?.[0]?.code
        ?.toLowerCase()
        .includes(searchText.toLowerCase());
    } else if (filterAttribute === "dateTime") {
      return observation.effectiveDateTime
        ?.toString()
        .toLowerCase()
        .includes(searchText.toLowerCase());
    } else if (filterAttribute === "bodySite") {
      return observation.bodySite?.coding?.[0]?.code
        ?.toString()
        .toLowerCase()
        .includes(searchText.toLowerCase());
    } else {
      return null;
    }
  });
  return filteredMedia;
};

/**
 * @deprecated Use `sortResources` instead.
 */
export const sortObservation = (
  observations: fhirR4.Observation[],
  sortAttribute: string
) => {
  const getValue = (observation: fhirR4.Observation) => {
    switch (sortAttribute) {
      case "identifier":
        return observation.identifier?.[0].value;
      case "status":
        return observation.status;
      case "code":
        return observation.code?.coding?.[0]?.code;
      case "dateTime":
        return observation.effectiveDateTime;
      case "bodySite":
        return observation.bodySite?.coding?.[0]?.code;
      // Add cases for other attributes you want to sort by
      default:
        return undefined;
    }
  };

  return observations.sort(
    (
      observationOne: fhirR4.Observation,
      observationTwo: fhirR4.Observation
    ) => {
      const imageOneValue = getValue(observationOne);
      const imageTwoValue = getValue(observationTwo);

      if (imageOneValue === undefined || imageTwoValue === undefined) {
        return 0;
      }

      return imageOneValue.localeCompare(imageTwoValue);
    }
  );
};

/**
 * @deprecated Use `sortResources` instead.
 */
export const sortPatients = (
  patients: fhirR4.Patient[],
  sortAttribute: string
) => {
  /**
   * Gets the value of the specified attribute for a given patient.
   * @param patient - The patient object.
   * @returns The value of the attribute or undefined if not found.
   */
  const getValue = (patient: fhirR4.Patient) => {
    switch (sortAttribute) {
      case "name":
        return patient.name?.[0]?.given?.[0];
      case "birthDate":
        return patient.birthDate;
      case "family":
        return patient.name?.[0]?.family;
      // Add cases for other attributes you want to sort by
      default:
        return undefined;
    }
  };

  return patients.sort(
    (patientOne: fhirR4.Patient, patientTwo: fhirR4.Patient) => {
      const patientOneValue = getValue(patientOne);
      const patientTwoValue = getValue(patientTwo);

      if (patientOneValue === undefined || patientTwoValue === undefined) {
        return 0;
      }

      return patientOneValue.localeCompare(patientTwoValue);
    }
  );
};
