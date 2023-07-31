import { fhirR4 } from "@smile-cdr/fhirts";
import { useState } from "react";
import {
  faArrowAltCircleLeft,
  faArrowAltCircleRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/**
 * This function filters an array of resources based on a specified attribute and a search text.
 *
 * @template T - The type of the resources in the array.
 *
 * @param {T[]} resources - An array of resources to be filtered.
 * @param {string} filterAttribute - The attribute on which the resources will be filtered.
 * @param {string} searchText - The text that will be searched within the specified filter attribute.
 *
 * @returns {T[]} - Returns a new array containing only the resources that meet the filter condition.
 *
 * @example
 * let patients = [...]; // Array of patient objects
 * let filteredPatients = filterResources(patients, "name", "John");
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
 * This function sorts an array of resources based on a specified attribute.
 *
 * @template T - A generic placeholder representing any type which extends an object with string keys and any type values.
 *
 * @param {T[]} resources - An array of resources to be sorted.
 * @param {string} sortAttribute - The attribute on which the resources will be sorted.
 *
 * @returns {T[]} - Returns a new array of resources sorted by the specified attribute.
 *
 * @example
 *
 * let patients = [...]; // Array of patient objects
 * let sortedPatients = sortResources(patients, "birthDate");
 *
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
 * The `RenderPatientPhotos` functional component is responsible for rendering patient photos.
 * It accepts a patient object (with type `fhirR4.Patient`) and dimensions for the images.
 *
 * @param {object} props - The props that this function receives.
 * @param {fhirR4.Patient} props.patient - The patient object which contains the photos to be rendered.
 * @param {string} props.w - The width of the photos to be rendered.
 * @param {string} props.h - The height of the photos to be rendered.
 *
 * @returns {JSX.Element} - Returns a JSX element which represents a view of patient's photos.
 * If no photos are present for a patient, it will render a text message stating that no attachment is available.
 *
 * @example
 *
 * <RenderPatientPhotos patient={patient} w={"100px"} h={"100px"} />
 *
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
 * The `renderPatientPhotos` function is responsible for determining whether a patient has photos to be rendered,
 * and if so, it delegates the rendering task to the `RenderPatientPhotos` component.
 *
 * @param {fhirR4.Patient} patient - The patient object which contains the photos to be rendered.
 * @param {string} maxW - The maximum width of the photos to be rendered.
 * @param {string} maxH - The maximum height of the photos to be rendered.
 *
 * @returns {string | JSX.Element} - Returns a JSX element which represents a view of patient's photos if available.
 * If no photos are present for a patient, it will return a string message stating that no attachment is available.
 *
 * @example
 *
 * renderPatientPhotos(patient, "100px", "100px");
 *
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
 * RenderObservationPhoto Component
 *
 * @param {object} media - A media object that contains the photo to be rendered.
 * @property {fhirR4.Media} media - The media object adheres to the `fhirR4.Media` structure.
 *
 * This component is responsible for rendering an observation photo. It receives a media object
 * as a prop. When the photo is clicked, it opens in a modal view which can be closed by clicking anywhere
 * outside the photo.
 *
 * The `media` object should have a `content` attribute, which is of `fhirR4.Attachment` type and
 * includes details of the photo - `id`, `contentType` and `data` (a base64 representation of the photo).
 *
 * @example
 * <RenderObservationPhoto media={media} />
 *
 * @returns A JSX element which represents a view of the observation's photo.
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
 * RenderObservations Component
 *
 * @param {object} media - An array of media objects each containing a photo to be rendered.
 * @property {fhirR4.Media[]} media - Each media object in the array adheres to the `fhirR4.Media` structure.
 *
 * This component is responsible for rendering a carousel of observation photos.
 * It receives an array of media objects as a prop. The carousel shows one image at a time
 * and provides arrows to navigate through the photos.
 *
 * The media objects should each have a `content` attribute, which is of `fhirR4.Attachment` type and
 * includes details of the photo - `id`, `contentType` and `data` (a base64 representation of the photo).
 *
 * @example
 * <RenderObservations media={mediaArray} />
 *
 * @returns A JSX element which represents a view of the observation's photos in a carousel.
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
 * Function to generate a patient's address as a string.
 *
 * @param {object} patient - A patient object based on the `fhirR4.Patient` structure.
 * @property {fhirR4.Patient} patient - The patient object should contain an `address` attribute which is an array of address objects.
 *
 * This function generates the patient's address in a readable string format. It looks for the `address`
 * attribute in the patient object, which is an array of address objects.
 * It then prioritizes the first address (at index 0) from the array for display.
 *
 * If an address object has a `text` property, that value is returned as the patient's address.
 * If there is no `text` property, it checks for `line`, `city`, `state`, and `postalCode` properties
 * and concatenates these to create the address string.
 *
 * If no address is found, the function returns a default string "No address available".
 *
 * @returns {string} A string representing the patient's address or a default string.
 *
 * @example
 * const patientAddress = generatePatientAddress(patientObj);
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
 * Asynchronous function to make a HTTP POST request to a specified resource.
 *
 * @param {string} resource - The specific resource endpoint to which the post request will be made.
 * @param {any} data - The data payload to be sent in the post request.
 * @param {string} token - The authentication token to be used in the post request.
 * @param {(status: "success" | "failure" | null) => void} handleStatus - The callback function to handle the status of the post request.
 * @param {any} headers - Any additional headers to be sent in the post request. Default is an empty object.
 *
 * This function makes a POST request to a specified resource URL. It sets the request method to "POST"
 * and includes the data payload, token, and additional headers in the request.
 * It checks the response status, if it's ok, it returns the response data after parsing it to JSON and updates the status using the `handleStatus` function.
 * If the response is not ok, it throws an error with the status text of the response.
 *
 * If any error occurs during the execution of the function, it's logged to the console, the status is updated using the `handleStatus` function, and the error is thrown.
 *
 * @returns {Promise<any>} A promise resolving to the response data in JSON format.
 *
 * @throws Will throw an error if the fetch request fails or if the response status is not ok.
 *
 * @example
 * post("Patient", patientData, authToken, handleStatus)
 *   .then(responseData => console.log(responseData))
 *   .catch(error => console.error(error));
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

/**
 * Function to get the display text for a given interpretation code.
 *
 * @param {string} code - The interpretation code.
 *
 * The function uses a predefined mapping of interpretation codes to display texts.
 * If the provided code exists in the mapping, it returns the corresponding display text.
 * If the code does not exist in the mapping, it returns the code itself.
 *
 * @returns {string} The display text for the given interpretation code, or the code itself if it is not found in the mapping.
 *
 * @example
 * const displayText = getDisplayTextForCode('H'); // Returns 'High'
 */
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
    // If the code exists in the mapping, return the corresponding display text
    return interpretationMapping[code];
  }

  // If the code is not found in the mapping, return the code itself
  return code;
};

/**
 * Function to display reference range for an observation.
 *
 * @param {fhirR4.ObservationReferenceRange[] | undefined} referenceRange - The reference range values to display.
 *
 * If the reference range array is not defined or empty, the function returns a hyphen ("-").
 * If the low and high values, along with their respective units, are defined in the reference range,
 * the function returns a formatted string displaying the range.
 *
 * @returns {string} A formatted string displaying the reference range, or a hyphen ("-") if the reference range is not defined.
 *
 * @example
 * const displayText = displayReferenceRange([{low: {value: 1, unit: 'mg', code: '123'}, high: {value: 5, unit: 'mg', code: '123'}}]);
 * // Returns '1 mg (123) - 5 mg (123)'
 */
export const displayReferenceRange = (
  referenceRange: fhirR4.ObservationReferenceRange[] | undefined
): string => {
  if (!referenceRange || referenceRange.length === 0) {
    // If reference range is undefined or empty, return a hyphen ("-")
    return "-";
  }

  const lowValue = referenceRange[0].low?.value;
  const lowUnit = referenceRange[0].low?.unit;
  const lowCode = referenceRange[0].low?.code;
  const highValue = referenceRange[0].high?.value;
  const highUnit = referenceRange[0].high?.unit;
  const highCode = referenceRange[0].high?.code;

  if (lowValue && highValue && lowUnit && highUnit) {
    // If both low and high values and units are defined, format them into a string
    const formattedLow = `${lowValue} ${lowUnit} (${lowCode})`;
    const formattedHigh = `${highValue} ${highUnit} (${highCode})`;
    return `${formattedLow} - ${formattedHigh}`;
  }

  // If any of the low or high values or units are not defined, return an empty string
  return "";
};
