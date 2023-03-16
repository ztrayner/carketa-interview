import { RepOptions, Representative } from "@/pages";
import {
  HStack,
  Heading,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Skeleton,
  Box,
  Text,
} from "@chakra-ui/react";
import RepresentativeDetails from "./RepresentativeDetails";

const SearchResults = ({
  isLoading,
  results,
  loadedRepOption,
  selectedRepresentative,
  setSelectedRepresentative,
}: {
  isLoading: boolean;
  results: Representative[];
  loadedRepOption: RepOptions[number] | null;
  selectedRepresentative: Representative | null;
  setSelectedRepresentative: (representative: Representative | null) => void;
}) => {
  if (results.length === 0 && !isLoading) {
    return null;
  }

  return (
    <HStack
      alignItems="start"
      justifyContent="space-evenly"
      spacing={4}
      h="100%"
    >
      <Box justifySelf="flex-start" flex={1}>
        <Heading as="h2" fontSize="2xl" fontWeight={400} mb={4}>
          List /{" "}
          <Text as="span" color="primary" textTransform="capitalize">
            {loadedRepOption}
          </Text>
        </Heading>
        <Table>
          <Thead>
            <Tr>
              <Th bg="gray.100" textTransform="unset" w="80%">
                Name
              </Th>
              <Th bg="gray.100" textTransform="unset" w="20%">
                Party
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {isLoading ? (
              <>
                <Tr w="100%">
                  <Td>
                    <Skeleton h="20px" w="100%" />
                  </Td>
                  <Td>
                    <Skeleton h="20px" w="100%" />
                  </Td>
                </Tr>
                <Tr w="100%">
                  <Td>
                    <Skeleton h="20px" w="100%" />
                  </Td>
                  <Td>
                    <Skeleton h="20px" w="100%" />
                  </Td>
                </Tr>
              </>
            ) : (
              <>
                {/* TODO: Prefetch data for hovered rows */}
                {results.map((representative) => (
                  <Tr
                    key={representative.name}
                    onClick={() => setSelectedRepresentative(representative)}
                    _hover={{ cursor: "pointer", bg: "gray.100" }}
                    tabIndex={0}
                    onKeyDown={(e) =>
                      ["Enter", "NumpadEnter"].includes(e.key)
                        ? setSelectedRepresentative(representative)
                        : null
                    }
                    bg={
                      selectedRepresentative?.name === representative.name
                        ? "primary.100"
                        : "inherit"
                    }
                  >
                    <Td>{representative.name}</Td>
                    <Td>{representative.party.charAt(0)}</Td>
                  </Tr>
                ))}
              </>
            )}
          </Tbody>
        </Table>
      </Box>
      <Box flex={1} position="relative">
        <Box position="sticky" top={2} zIndex={1}>
          <Heading as="h2" fontSize="2xl" fontWeight={400} mb={4}>
            Info
          </Heading>
          <RepresentativeDetails representative={selectedRepresentative} />
        </Box>
      </Box>
    </HStack>
  );
};

export default SearchResults;
