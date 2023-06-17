import React, { useState, useEffect, ChangeEvent } from "react";
import { fhirR4 } from "@smile-cdr/fhirts";
import BundleEntry from "./BundleEntry";
import { useNavigate } from "react-router-dom";
import {
  filterPatients,
  sortPatients,
  renderPatientPhotos,
  generatePatientAddress,
} from "./utils";
import HomeButton from "./HomeButton";

const PatientList: React.FC = () => {
  // State variables
  const [patients, setPatients] = useState<fhirR4.Patient[]>([]);
  const [searchText, setSearchText] = useState("");
  const [filterAttribute, setFilterAttribute] = useState("");
  const [sortAttribute, setSortAttribute] = useState("");
  const navigate = useNavigate();

  // Fetch patients when the component mounts
  useEffect(() => {
    fetchPatients();
  }, []);

  // Fetch patients from the Server
  const fetchPatients = async () => {
    try {
      const response = await fetch("http://localhost:8080/fhir/Patient"); // Replace with your API endpoint
      const data = await response.json();
      // Extract the resource property from the Bundle entry
      const patientsData = data.entry.map(
        (entry: BundleEntry) => entry.resource
      );
      // Store the extracted patients in state
      setPatients(patientsData);
      //console.log(patientsData);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  // Filter patients based on the selected attribute and search text

  const filterAndSortPatients = () => {
    const filteredPatients = filterPatients(
      patients,
      filterAttribute,
      searchText
    );
    const sortedPatients = sortPatients(filteredPatients, sortAttribute);
    return sortedPatients;
  };

  // Handle search input change
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };
  // Handle attributes selection change
  const handleFilterAttributeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setFilterAttribute(event.target.value);
  };
  const handleSortAttributeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSortAttribute(event.target.value);
  };

  // Refresh the patient data by fetching patients again
  const handleRefresh = () => {
    fetchPatients(); // Fetch patients again to refresh the data
  };

  // Navigate to the patient detail page with the patientId as a parameter
  const handleRowClick = (patientId: string | undefined) => {
    if (patientId) {
      // Navigate to the patient detail page with the patientId as a parameter
      navigate(`/patient/${patientId}`);
    }
  };

  return (
    <div>
      <div>
        <HomeButton />
      </div>
      <div className="flex justify-center h-auto p-10 bg-sky-800 text-4xl text-white mb-10 overflow-x-auto">
        <div className="max-w-full md:max-w-[80%] lg:max-w-[70%]">
          What are you looking for?
        </div>
      </div>
      <div className="flex flex-wrap items-center mb-4 font-mono md:font-mono text-lg/5 md:text-lg/5 justify-center">
        <select
          className="rounded border-b-2 mr-2 font-mono md:font-mono text-lg/5 md:text-lg/5 mb-2 md:mb-0"
          value={filterAttribute}
          onChange={handleFilterAttributeChange}
        >
          <option value="">Search by</option>
          <option value="name">Name</option>
          <option value="family">Family Name</option>
          <option value="birthDate">Birth Date</option>
          <option value="identifier">Identifier</option>
          {/* Add options for other attributes */}
        </select>
        <select
          className="rounded border-b-2 mr-2 font-mono md:font-mono text-lg/5 md:text-lg/5 mb-2 md:mb-0"
          value={sortAttribute}
          onChange={handleSortAttributeChange}
        >
          <option value="">Sort by</option>
          <option value="name">Name</option>
          <option value="family">Family Name</option>
          <option value="birthDate">Birth Date</option>
          {/* Add options for other attributes */}
        </select>
        <input
          className="rounded border-b-2 mr-2"
          type="text"
          value={searchText}
          onChange={handleSearch}
          placeholder="Search"
        />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleRefresh}
        >
          Refresh
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-4 font-mono md:font-mono text-lg/5 md:text-lg/5">
                Identifier
              </th>
              <th className="p-4 font-mono md:font-mono text-lg/5 md:text-lg/5">
                Active
              </th>
              <th className="p-4 font-mono md:font-mono text-lg/5 md:text-lg/5">
                Vorname
              </th>
              <th className="p-4 font-mono md:font-mono text-lg/5 md:text-lg/5">
                Nachname
              </th>
              <th className="p-4 font-mono md:font-mono text-lg/5 md:text-lg/5">
                Gender
              </th>
              <th className="p-4 font-mono md:font-mono text-lg/5 md:text-lg/5">
                Birthday
              </th>
              <th className="p-4 font-mono md:font-mono text-lg/5 md:text-lg/5">
                Phone
              </th>
              <th className="p-4 font-mono md:font-mono text-lg/5 md:text-lg/5">
                Email
              </th>
              <th className="p-4 font-mono md:font-mono text-lg/5 md:text-lg/5">
                Adresse
              </th>
              <th className="p-4 font-mono md:font-mono text-lg/5 md:text-lg/5">
                Attachement
              </th>
            </tr>
          </thead>
          <tbody>
            {filterAndSortPatients().map((patient) => (
              <tr
                key={patient.id}
                onClick={() => handleRowClick(patient.id)}
                className="cursor-pointer hover:bg-gray-100"
              >
                <td className="p-4 font-mono md:font-mono text-lg/2 md:text-lg/2 whitespace-nowrap">
                  {patient.identifier?.[0]?.value === undefined ? (
                    <div className="flex items-center justify-center h-full">
                      Nun
                    </div>
                  ) : (
                    patient.identifier?.[0]?.value
                  )}
                </td>
                <td className="p-4 font-mono md:font-mono text-lg/5 md:text-lg/5">
                  {patient.active ? "aktiv" : "inaktiv"}
                </td>
                <td className="p-4 font-mono md:font-mono text-lg/5 md:text-lg/5">
                  {patient.name?.[0]?.given}
                </td>
                <td className="p-4 font-mono md:font-mono text-lg/5 md:text-lg/5">
                  {patient.name?.[0]?.family}
                </td>
                <td className="p-4 font-mono md:font-mono text-lg/5 md:text-lg/5">
                  {patient.gender}
                </td>
                <td className="p-4 font-mono md:font-mono text-lg/5 md:text-lg/5 whitespace-nowrap">
                  {patient.birthDate}
                </td>
                {/* Phone */}
                <td className="p-4 font-mono md:font-mono text-lg/5 md:text-lg/5 whitespace-nowrap">
                  {patient.telecom?.[0]?.value === undefined ? (
                    <div className="flex items-center justify-center">Nun</div>
                  ) : (
                    patient.telecom?.[0]?.value
                  )}
                </td>
                {/* Mail */}
                <td className="p-4 font-mono md:font-mono text-lg/5 md:text-lg/5 whitespace-nowrap">
                  {patient.telecom?.[1]?.value === undefined ? (
                    <div className="flex items-center justify-center">Nun</div>
                  ) : (
                    patient.telecom?.[1]?.value
                  )}
                </td>
                <td className="p-4 font-mono md:font-mono text-lg/5 md:text-lg/5">
                  {generatePatientAddress(patient)}
                </td>
                <td className="p-4 flex justify-center font-mono md:font-mono text-lg/5 md:text-lg/5 h-auto max-w-sm hover:shadow-lg dark:shadow-black/30">
                  {renderPatientPhotos(patient)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PatientList;
