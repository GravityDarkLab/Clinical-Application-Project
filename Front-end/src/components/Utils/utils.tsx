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
  if (!resources) {
    return [];
  }
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
      return [];
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
  if (!resources) {
    return [];
  }
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
      case "creationDate":
        return resource.id;
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

const RenderPatientPhotos = ({
  patient,
  w,
  h,
}: {
  patient: fhirR4.Patient;
  w: string;
  h: string;
}) => {
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
            src={`data:${photo.contentType};base64,${photo.data}`}
            alt="Patient Attachment"
            className="object-cover w-full h-full"
            style={{ maxWidth: w, maxHeight: h }}
          />
        </div>
      ))}
      {selectedPhoto && (
        <div
          className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-75 z-50"
          onClick={() => setSelectedPhoto(null)}
        >
          <img
            src={`data:${selectedPhoto.contentType};base64,${selectedPhoto.data}`}
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

export const renderPatientPhotos = (
  patient: fhirR4.Patient,
  maxW: string,
  maxH: string
) => {
  if (!patient.photo || patient.photo.length === 0) {
    return "No attachment available";
  }
  return <RenderPatientPhotos patient={patient} w={maxW} h={maxH} />;
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
          src={`data:${media.content.contentType};base64,${media.content.data}`}
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
            src={`data:${selectedPhoto.contentType};base64,${selectedPhoto.data}`}
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
export const RenderObservations = ({ media }: { media: fhirR4.Media[] }) => {
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

/**
 * Sends a POST request to the specified URL with the provided data and headers.
 *
 * @param url - The URL to send the POST request to.
 * @param data - The data to include in the request body.
 * @param headers - Additional headers to include in the request.
 * @returns A Promise that resolves to the JSON response if the request is successful, or throws an error if the request fails.
 */
export const post = async (
  resource: string,
  data: any,
  token: string,
  handleStatus: (status: "success" | "failure" | null) => void,
  headers: any = {}
) => {
  try {
    const url = `http://localhost:8080/fhir/${resource}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const responseData = await response.json();
      handleStatus("success");
      return responseData;
    } else {
      throw new Error(`Request failed: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error:", error);
    handleStatus("failure");
    throw error;
  }
};

export const getDisplayTextForCode = (code: string): string => {
  // Define a mapping of interpretation codes to display text
  const interpretationMapping: Record<string, string> = {
    H: "High",
    L: "Low",
    N: "Normal",
    R: "Resistant",
    S: "Susceptible",
    U: "Unable to Determine",
  };

  // Check if the code exists in the mapping
  if (interpretationMapping.hasOwnProperty(code)) {
    return interpretationMapping[code];
  }

  // If the code is not found, return the code itself
  return code;
};

export const displayReferenceRange = (
  referenceRange: fhirR4.ObservationReferenceRange[] | undefined
): string => {
  if (!referenceRange || referenceRange.length === 0) {
    return "-";
  }

  const lowValue = referenceRange[0].low?.value;
  const lowUnit = referenceRange[0].low?.unit;
  const lowCode = referenceRange[0].low?.code;
  const highValue = referenceRange[0].high?.value;
  const highUnit = referenceRange[0].high?.unit;
  const highCode = referenceRange[0].high?.code;

  if (lowValue && highValue && lowUnit && highUnit) {
    const formattedLow = `${lowValue} ${lowUnit} (${lowCode})`;
    const formattedHigh = `${highValue} ${highUnit} (${highCode})`;
    return `${formattedLow} - ${formattedHigh}`;
  }

  return "";
};
