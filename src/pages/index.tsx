import { useState } from "react";
import { NextPage } from "next";
import Select from "react-select";
import states from "@/utils/states";

interface Representative {
  name: string;
  party: string;
  district: string;
  phone: string;
  office: string;
  link: string;
}

interface State {
  value: string;
  label: string;
}

const representativesEndpoint = "/api/representatives/";
const senatorsEndpoint = "/api/senators/";

const SearchPage: NextPage = () => {
  const [searchType, setSearchType] = useState("representatives");
  const [state, setState] = useState<State | null>(null);
  const [results, setResults] = useState<Representative[]>([]);

  const handleSearchTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSearchType(event.target.value);
  };

  const handleStateChange = (state: State | null) => {
    setState(state);
  };

  const handleSearch = async () => {
    if (!state) return;

    try {
      const endpoint =
        searchType === "representatives"
          ? representativesEndpoint
          : senatorsEndpoint;
      const response = await fetch(`${endpoint}${state.value}`);
      const { success, results, error } = await response.json();

      if (!success) {
        throw new Error(error);
      }

      setResults(results);
    } catch (error) {
      console.error(error);
      setResults([]);
    }
  };

  const renderResults = () => {
    if (results.length === 0) {
      return <div>No results found.</div>;
    }

    return (
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Party</th>
          </tr>
        </thead>
        <tbody>
          {results.map((representative) => (
            <tr key={representative.name}>
              <td>
                <button onClick={() => console.log(representative)}>
                  {representative.name}
                </button>
              </td>
              <td>{representative.party}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div>
      <h1>Search for Representatives and Senators</h1>
      <div>
        <label htmlFor="search-type">Search Type:</label>
        <select id="search-type" onChange={handleSearchTypeChange}>
          <option value="representatives">Representatives</option>
          <option value="senators">Senators</option>
        </select>
      </div>
      <div>
        <label htmlFor="state">State:</label>
        <Select
          id="state"
          options={states}
          value={state}
          onChange={handleStateChange}
        />
      </div>
      <button onClick={handleSearch}>Search</button>
      <div>{renderResults()}</div>
    </div>
  );
};

export default SearchPage;
