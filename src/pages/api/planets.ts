import type { NextApiRequest, NextApiResponse } from "next";

interface Resident {
  name: string;
}

interface Planet {
  name: string;
  rotation_period: string;
  orbital_period: string;
  diameter: string;
  climate: string;
  gravity: string;
  terrain: string;
  surface_water: string;
  population: string;
  residents: string[];
  films: string[];
  created: string;
  edited: string;
  url: string;
}

const getResidentNames = async (residentsUrls: string[]): Promise<string[]> => {
  const residentNames: string[] = [];
  const promises = residentsUrls.map(async (residentUrl) => {
    try {
      const response = await fetch(residentUrl);
      const resident = await response.json();
      residentNames.push(resident.name);
    } catch (error) {
      console.error(error);
    }
  });
  await Promise.allSettled(promises);
  return residentNames;
};

const fetchPlanets = async (
  url: string,
  planets: Planet[] = []
): Promise<Planet[]> => {
  const response = await fetch(url);
  const data = await response.json();
  planets.push(...data.results);
  if (data.next) {
    // recursively fetch next page
    return fetchPlanets(data.next, planets);
  } else {
    // all pages fetched, return planets
    return planets;
  }
};

const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
  try {
    const planets = await fetchPlanets("https://swapi.dev/api/planets/");
    const promises = planets.map(async (planet) => {
      const residentNames = await getResidentNames(planet.residents);
      return {
        ...planet,
        residents: residentNames,
      };
    });
    const results = await Promise.allSettled(promises);
    // Log any errors that occurred
    results.forEach((result, index) => {
      if (result.status === "rejected") {
        console.error(
          `Promise at index ${index} failed with error:`,
          result.reason
        );
      }
    });
    const validPlanets = results
      .filter((planet): planet is PromiseFulfilledResult<Planet> => {
        return planet.status === "fulfilled" && planet.value !== null;
      })
      .map((planet) => planet.value);

    // Set the Cache-Control header to enable client-side and proxy caching for 1 hour
    res.setHeader(
      "Cache-Control",
      `max-age=3600, s-maxage=3600, stale-while-revalidate`
    );
    res.status(200).json(validPlanets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching planets data." });
  }
};

export default handler;
