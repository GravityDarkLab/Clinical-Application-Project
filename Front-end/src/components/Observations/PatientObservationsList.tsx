import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fhirR4 } from "@smile-cdr/fhirts";
import {
  filterResources,
  sortResources,
  getDisplayTextForCode,
  displayReferenceRange,
} from "../Utils/utils";
import { useNavigate } from "react-router-dom";
import BundleEntry from "../Utils/BundleEntry";
import { useAuth0 } from "@auth0/auth0-react";
import Banner from "../elements/Banner";

const PatientObservationsList = () => {
  const { patientId } = useParams();
  const [media, setMedia] = useState<fhirR4.Observation[]>([]);
  const [searchText, setSearchText] = useState("");
  const [filterAttribute, setFilterAttribute] = useState("identifier");
  const [sortAttribute, setSortAttribute] = useState("");
  const [mediaPerPage, setMediaPerPage] = useState(20);
  const [offsetMediaPerPage, setoffsetMediaPerPage] = useState(0);
  const { getAccessTokenSilently } = useAuth0();

  const navigate = useNavigate();

  useEffect(() => {
    fetchObservation();
  }, [patientId, mediaPerPage, offsetMediaPerPage, getAccessTokenSilently]);

  /**
   * Navigate to the Add Observation page for a given patient.
   * @param {string} patientId - The ID of the patient.
   */
  const handleClickAddObservation = async (patientId: string | undefined) => {
    if (patientId) {
      navigate(`/observations/addObservation/${patientId}`);
    }
  };
  /**
   * Update the number of Observations to be displayed per page.
   * @param {string} value - The number of Observations to be displayed per page.
   */
  const handleObservationPerPageChange = (value: string) => {
    const parsedValue = parseInt(value, 10);
    setMediaPerPage(parsedValue);
  };
  /**
   * Update the offset for the Observations page.
   * @param {number} value - The offset value.
   */
  const handleOffsetObervationPerPageChange = (value: number) => {
    if (value < 0) {
      value = 0;
    }
    setoffsetMediaPerPage(value);
  };
  /**
   * Handle changes in the selected filter attribute.
   * @param {Object} event - The event object.
   */
  const handleFilterAttributeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setFilterAttribute(event.target.value);
  };
  /**
   * Handle changes in the selected sort attribute.
   * @param {Object} event - The event object.
   */
  const handleSortAttributeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSortAttribute(event.target.value);
  };
  /**
   * Fetch Observations data for a given patient.
   */
  const fetchObservation = async () => {
    const token = await getAccessTokenSilently();
    try {
      const response = await fetch(
        `http://localhost:8080/fhir/Observation?subject=${patientId}&_count=${mediaPerPage}&_offset=${offsetMediaPerPage}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      const patientsData = data?.entry?.map(
        (entry: BundleEntry) => entry.resource
      );

      setMedia(patientsData);
    } catch (error) {
      console.error("Error fetching patient:", error);
    }
  };
  /**
   * Refresh the Observation data by re-fetching it from the server.
   */
  const handleRefresh = () => {
    fetchObservation(); // Fetch patients again to refresh the data
  };

  /**
   * Update the search text when the search input changes.
   * @param {Object} event - The event object.
   */
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  /**
   * Navigate to the detail page for a given observation.
   * @param {string} observationId - The ID of the observation.
   */
  const handleRowClick = (observationId: string | undefined) => {
    if (observationId) {
      // Navigate to the patient detail page with the patientId as a parameter
      navigate(`/observation/${observationId}`);
    }
  };
  /**
   * Filter and sort the Observations.
   * @return {Array} The filtered and sorted Observations.
   */
  const filterAndSortObservation = () => {
    const filteredPatients = filterResources(
      media,
      filterAttribute,
      searchText
    );
    const sortedPatients = sortResources(filteredPatients, sortAttribute);
    return sortedPatients;
  };

  return (
    <div>
      <Banner>All related Observations</Banner>
      <div className="flex justify-center">
        <h1 className="text-2xl font-bold m-4">Patient Media</h1>

        <button
          onClick={() => handleClickAddObservation(patientId)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-5 m-4 rounded text-lg "
        >
          Add Observation
        </button>
      </div>
      <div>
        <div className="flex flex-wrap items-center mb-4 font-mono md:font-mono text-lg/5 md:text-lg/5 justify-center">
          <select
            className="rounded border-b-2 mr-2 font-mono md:font-mono text-lg/5 md:text-lg/5 mb-2 md:mb-0"
            value={filterAttribute}
            onChange={handleFilterAttributeChange}
          >
            <option value="">Search by</option>
            <option value="identifier">Identifier</option>
            <option value="status">Status</option>
            <option value="type">Type</option>
            <option value="dateTime">Issue date</option>
            <option value="bodySite">Body Site</option>
            {/* Add options for other attributes */}
          </select>
          <select
            className="rounded border-b-2 mr-2 font-mono md:font-mono text-lg/5 md:text-lg/5 mb-2 md:mb-0"
            value={sortAttribute}
            onChange={handleSortAttributeChange}
          >
            <option value="">Sort by</option>
            <option value="identifier">Identifier</option>
            <option value="status">Status</option>
            <option value="type">Type</option>
            <option value="dateTime">Issue date</option>
            <option value="bodySite">Body Site</option>
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

        <div className="flex flex-wrap items-center mb-4 font-mono md:font-mono text-lg/5 md:text-lg/5 justify-center">
          <div className="ml-4">
            <label htmlFor="numberSelect">Observation per Page:</label>
            <select
              id="numberSelect"
              onChange={(e) => handleObservationPerPageChange(e.target.value)}
              defaultValue={"20"}
            >
              <option value="">Select a number</option>
              <option value="20">20</option>
              <option value="30">30</option>
              <option value="40">40</option>
              <option value="50">50</option>

              {/* Add more options if needed */}
            </select>
          </div>

          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2"
            onClick={() =>
              handleOffsetObervationPerPageChange(
                offsetMediaPerPage - mediaPerPage
              )
            }
          >
            Prev {mediaPerPage} Observation
          </button>

          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2"
            onClick={() =>
              handleOffsetObervationPerPageChange(
                offsetMediaPerPage + mediaPerPage
              )
            }
          >
            Next {mediaPerPage} Observation
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-4 font-semibold text-center border">
                Identifier
              </th>
              <th className="p-4 font-semibold text-center border">Status</th>
              <th className="p-4 font-semibold text-center border">Type</th>
              <th className="p-4 font-semibold text-center whitespace-nowrap border">
                Issue Date
              </th>
              <th className="p-4 font-semibold text-center whitespace-nowrap border">
                Body Site
              </th>
              <th className="p-4 font-semibold text-center border">
                Interpretation
              </th>
              <th className="p-4 font-semibold text-center border">Range</th>
              <th className="p-4 font-semibold text-center border">
                Performer
              </th>
              <th className="p-4 font-semibold text-center border">Note</th>
            </tr>
          </thead>
          <tbody>
            {filterAndSortObservation().map((observation) => (
              <tr
                key={observation.id}
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => handleRowClick(observation.id)}
              >
                <td className="p-4 font-mono md:font-mono text-lg/2 md:text-lg/2 border whitespace-nowrap">
                  {observation.identifier?.[0]?.value === undefined ? (
                    <div className="flex items-center justify-center h-full">
                      Nun
                    </div>
                  ) : (
                    observation.identifier?.[0]?.value
                  )}
                </td>
                <td className="p-4 font-mono md:font-mono text-lg/5 md:text-lg/5 border">
                  {observation.status}
                </td>
                <td className="p-4 font-mono md:font-mono text-lg/5 md:text-lg/5 border">
                  {observation.category?.[0]?.coding?.[0]?.code || "-"}
                </td>
                <td className="p-4 font-mono md:font-mono text-lg/5 md:text-lg/5 border">
                  {observation.issued}
                </td>
                <td className="p-4 font-mono md:font-mono text-lg/5 md:text-lg/5 border whitespace-nowrap">
                  {observation.bodySite?.text || "-"}
                </td>
                <td className="p-4 font-mono md:font-mono text-lg/5 md:text-lg/5 border whitespace-nowrap">
                  {observation.interpretation?.[0]?.coding?.[0]?.display
                    ? getDisplayTextForCode(
                        observation.interpretation?.[0]?.coding?.[0]?.display
                      )
                    : "-"}
                </td>
                <td className="p-4 font-mono md:font-mono text-lg/5 md:text-lg/5 border whitespace-nowrap">
                  {displayReferenceRange(observation.referenceRange)}
                </td>
                <td className="p-4 font-mono md:font-mono text-lg/5 md:text-lg/5 border whitespace-nowrap">
                  {observation.performer?.[0]?.display || "-"}
                </td>
                <td className="p-4 font-mono md:font-mono text-lg/5 md:text-lg/5 border whitespace-nowrap">
                  {observation.note?.[0]?.text || "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center mt-4">{/* Pagination buttons */}</div>
    </div>
  );
};

export default PatientObservationsList;
