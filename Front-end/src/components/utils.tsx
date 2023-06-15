import { fhirR4 } from "@smile-cdr/fhirts";
import Patient from "./Patient";

export const filterPatients = (
  patients: Patient[],
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
      // Add conditions for other attributes you want to filter by
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
export const sortPatients = (patients: Patient[], sortAttribute: string) => {
  /**
   * Gets the value of the specified attribute for a given patient.
   * @param patient - The patient object.
   * @returns The value of the attribute or undefined if not found.
   */
  const getValue = (patient: Patient) => {
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

  return patients.sort((patientOne: Patient, patientTwo: Patient) => {
    const patientOneValue = getValue(patientOne);
    const patientTwoValue = getValue(patientTwo);

    if (patientOneValue === undefined || patientTwoValue === undefined) {
      return 0;
    }

    return patientOneValue.localeCompare(patientTwoValue);
  });
};
