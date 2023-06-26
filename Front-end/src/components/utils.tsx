import { fhirR4 } from "@smile-cdr/fhirts";
import { useState } from "react";

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
 * Sorts an array of patients based on the specified sort attribute.
 * @param patients - The array of patients to be sorted.
 * @param sortAttribute - The attribute to sort the patients by ("name", "birthDate", "family", etc.).
 * @returns The sorted array of patients.
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
