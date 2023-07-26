import React, { useState, useEffect } from "react";
import { fhirR4 } from "@smile-cdr/fhirts";
import BundleEntry from "../Utils/BundleEntry";
import { useAuth0 } from "@auth0/auth0-react";
import { filterResources, sortResources } from "../Utils/utils";
import Banner from "../elements/Banner";
import { useNavigate } from "react-router-dom";

const ObservationAll: React.FC = () => {
  // State variables
  const { getAccessTokenSilently } = useAuth0();
  const [observations, setObservations] = useState<fhirR4.Observation[]>([]);
  const [searchText, setSearchText] = useState("");
  const [filterAttribute, setFilterAttribute] = useState("code");
  const [sortAttribute, setSortAttribute] = useState("date");
  const [observationsPerPage, setObservationsPerPage] = useState(20);
  const [offsetObservationsPerPage, setoffsetObservationsPerPage] = useState(0);
  const navigate = useNavigate();

  // Fetch observations when the component mounts
  useEffect(() => {
    fetchObservations();
  }, [observationsPerPage, offsetObservationsPerPage, getAccessTokenSilently]);

  // Fetch observations from the Server
  const fetchObservations = async () => {
    const token = await getAccessTokenSilently();
    try {
      const response = await fetch(
        "http://localhost:8080/fhir/Observation?_count=" +
          observationsPerPage +
          "&_offset=" +
          offsetObservationsPerPage,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "http://localhost:8080/fhir/Patient?_count=" +
          observationsPerPage +
          "&_offset=" +
          offsetObservationsPerPage
      );

      const data = await response.json();
      // Extract the resource property from the Bundle entry
      if ("entry" in data) {
        const observationsData = data.entry.map(
          (entry: BundleEntry) => entry.resource
        );
        // Store the extracted observations in state
        setObservations(observationsData);
      } else {
        //TODO : What should happen if we have reached the limit. Some warning?
      }
    } catch (error) {
      console.error("Error fetching observations:", error);
    }
  };

  // Navigate to the Observation detail page with the patientId as a parameter
  const handleRowClick = (observationId: string | undefined) => {
    if (observationId) {
      // Navigate to the patient detail page with the patientId as a parameter
      navigate(`/observation/${observationId}`);
    }
  };

  // Filter observations based on the selected attribute and search text
  const filterAndSortObservations = () => {
    const filteredObservations = filterResources(
      observations,
      filterAttribute,
      searchText
    );
    const sortedObservations = sortResources(
      filteredObservations,
      sortAttribute
    );
    return sortedObservations;
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

  // Refresh the observation data by fetching observations again
  const handleRefresh = () => {
    fetchObservations(); // Fetch observations again to refresh the data
  };

  const handleObservationsPerPageChange = (value: string) => {
    const parsedValue = parseInt(value, 10);
    setObservationsPerPage(parsedValue);
  };

  const handleOffsetObservationPerPageChange = (value: number) => {
    if (value < 0) {
      value = 0;
    }
    setoffsetObservationsPerPage(value);
  };
  return (
    <div>
      <Banner>What are you looking for?</Banner>
      <div>
        <div className="flex flex-wrap items-center mb-4 font-mono md:font-mono text-lg/5 md:text-lg/5 justify-center">
          <select
            className="rounded border-b-2 mr-2 font-mono md:font-mono text-lg/5 md:text-lg/5 mb-2 md:mb-0"
            value={filterAttribute}
            onChange={handleFilterAttributeChange}
          >
            <option value="">Search by</option>
            <option value="subject">Subject</option>
            <option value="code">Code</option>
            <option value="category">Category</option>
            <option value="effective">Effective Date</option>
            <option value="identifier">Identifier</option>
          </select>
          <select
            className="rounded border-b-2 mr-2 font-mono md:font-mono text-lg/5 md:text-lg/5 mb-2 md:mb-0"
            value={sortAttribute}
            onChange={handleSortAttributeChange}
          >
            <option value="">Sort by</option>
            <option value="subject">Subject</option>
            <option value="code">Code</option>
            <option value="category">Category</option>
            <option value="effective">Effective Date</option>
            <option value="creationDate">Creation Date</option>
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

        <div className="flex flex-wrap items-center mb-4 font-mono md:font-mono text-lg/5 md:text-lg/5 justify-center">
          <div className="ml-4">
            <label htmlFor="numberSelect">Observations per Page:</label>
            <select
              id="numberSelect"
              onChange={(e) => handleObservationsPerPageChange(e.target.value)}
              defaultValue={"20"}
            >
              <option value="">Select a number</option>
              <option value="20">20</option>
              <option value="30">30</option>
              <option value="40">40</option>
              <option value="50">50</option>
            </select>
          </div>

          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2"
            onClick={() =>
              handleOffsetObservationPerPageChange(
                offsetObservationsPerPage - observationsPerPage
              )
            }
          >
            Prev {observationsPerPage} Observations
          </button>

          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2"
            onClick={() =>
              handleOffsetObservationPerPageChange(
                offsetObservationsPerPage + observationsPerPage
              )
            }
          >
            Next {observationsPerPage} Observations
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-4 font-mono md:font-mono text-lg/5 md:text-lg/5">
                Identifier
              </th>
              <th className="p-4 font-mono md:font-mono text-lg/5 md:text-lg/5">
                Subject
              </th>
              <th className="p-4 font-mono md:font-mono text-lg/5 md:text-lg/5">
                Code
              </th>
              <th className="p-4 font-mono md:font-mono text-lg/5 md:text-lg/5">
                Category
              </th>
              <th className="p-4 font-mono md:font-mono text-lg/5 md:text-lg/5">
                Effective Date
              </th>
              <th className="p-4 font-mono md:font-mono text-lg/5 md:text-lg/5">
                Value
              </th>
            </tr>
          </thead>
          <tbody>
            {filterAndSortObservations().map((observation) => (
              <tr
                key={observation.id}
                onClick={() => handleRowClick(observation.id)}
                className="cursor-pointer hover:bg-gray-100"
              >
                <td className="p-4 font-mono md:font-mono text-lg/2 md:text-lg/2 whitespace-nowrap">
                  {observation.identifier?.[0]?.value === undefined ? (
                    <div className="flex items-center justify-center h-full">
                      Nun
                    </div>
                  ) : (
                    observation.identifier?.[0]?.value
                  )}
                </td>
                <td className="p-4 font-mono md:font-mono text-lg/5 md:text-lg/5">
                  <a
                    href={
                      "http://localhost:3000/" + observation.subject?.reference
                    }
                  >
                    {observation.subject?.display}
                  </a>
                </td>
                <td className="p-4 font-mono md:font-mono text-lg/5 md:text-lg/5">
                  {observation.code.text}
                </td>
                <td className="p-4 font-mono md:font-mono text-lg/5 md:text-lg/5">
                  {observation?.category?.[0].text}
                </td>
                <td className="p-4 font-mono md:font-mono text-lg/5 md:text-lg/5">
                  {observation.effectiveDateTime}
                </td>
                <td className="p-4 font-mono md:font-mono text-lg/5 md:text-lg/5">
                  {observation.valueQuantity
                    ? `${observation.valueQuantity.value} ${observation.valueQuantity.unit}`
                    : "Nun"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ObservationAll;
