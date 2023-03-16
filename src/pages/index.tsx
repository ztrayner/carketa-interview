import { useState } from "react";
import { NextPage } from "next";
import Select, { SingleValue } from "react-select";
import states, { State } from "@/utils/states";
import { Box, Button, Container, Heading } from "@chakra-ui/react";
import SearchResults from "@/components/SearchResults";

export interface Representative {
  name: string;
  party: string;
  district: string;
  phone: string;
  office: string;
  link: string;
}

const representativesEndpoint = "/api/representatives/";
const senatorsEndpoint = "/api/senators/";
const repOptions = [
  { value: "representatives", label: "Representatives" },
  { value: "senators", label: "Senators" },
];
export type RepOptions = typeof repOptions[number]["value"];

const SearchPage: NextPage = () => {
  const [selectedRepOption, setSelectedRepOption] = useState<RepOptions | null>(null);
  const [loadedRepOption, setLoadedRepOption] = useState<RepOptions | null>(
    null
  );
  const [state, setState] = useState<State | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<Representative[]>([]);
  const [selectedRepresentative, setSelectedRepresentative] =
    useState<Representative | null>(null);
  const buttonIsDisabled = !state || !selectedRepOption || isLoading;

  const handleSearchTypeChange = (
    newValue: SingleValue<{ value: string; label: string }>
  ) => {
    setSelectedRepOption(newValue?.value || null);
  };

  const handleStateChange = (state: State | null) => {
    setState(state);
  };

  const handleSearch = async () => {
    if (!state) return;
    setIsLoading(true);
    setSelectedRepresentative(null);
    setLoadedRepOption(selectedRepOption);

    try {
      const endpoint =
        selectedRepOption === "representatives"
          ? representativesEndpoint
          : senatorsEndpoint;
      const response = await fetch(`${endpoint}${state.value}`);
      const { success, results, error } = await response.json();

      if (!success) {
        // TODO: Show user-friendly error message
        setLoadedRepOption(null);
        setResults([]);
        console.error(error);
        throw new Error(error);
      }
      setResults(results);
    } catch (error) {
      console.error(error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxW="760px" my={12}>
      <Heading as="h1" color="primary" mb={4}>
        Who&apos;s My Representative
      </Heading>
      <Box my={4} maxW="300px" w="100%">
        <Box my={2} pos="relative" zIndex={3}>
          <label htmlFor="search-type">Search Type:</label>
          <Select
            id="search-type"
            instanceId="search-type"
            isSearchable={false}
            onChange={handleSearchTypeChange}
            options={repOptions}
            />
        </Box>
        <Box my={2} pos="relative" zIndex={2}>
          <label htmlFor="state">State:</label>
          <Select
            id="state"
            instanceId="state"
            onChange={handleStateChange}
            options={states}
            value={state}
            />
        </Box>
      </Box>
      <Button
        isDisabled={buttonIsDisabled}
        isLoading={isLoading}
        bg={"primary"}
        sx={{
          _hover: {
            bg: "primary.300",
          },
          _disabled: {
            bg: "gray.300",
            cursor: "not-allowed",
            _hover: {
              bg: "gray.300",
            },
          },
        }}
        onClick={handleSearch}
        mb={4}
      >
        Search
      </Button>
      <Box my={4} w="100%">
        <SearchResults
          isLoading={isLoading}
          results={results}
          loadedRepOption={loadedRepOption}
          selectedRepresentative={selectedRepresentative}
          setSelectedRepresentative={setSelectedRepresentative}
        />
      </Box>
    </Container>
  );
};

export default SearchPage;
