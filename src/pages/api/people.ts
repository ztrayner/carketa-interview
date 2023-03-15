import type { NextApiRequest, NextApiResponse } from "next";

type SortBy = "name" | "height" | "mass";

interface Person {
  name: string;
  height: string;
  mass: string;
}

const compare = (a: string | number, b: string | number): number => {
  if (typeof a === "string" && typeof b === "string") {
    const aNum = parseFloat(a.replace(/,/g, ""));
    const bNum = parseFloat(b.replace(/,/g, ""));
    if (isNaN(aNum) || isNaN(bNum)) {
      // If either value is not a number, fall back to string comparison
      return a.localeCompare(b);
    } else {
      // Otherwise, compare numerically
      return aNum - bNum;
    }
  }
  return Number(a) - Number(b);
};

async function fetchPeopleData(url: string): Promise<Person[]> {
  const response = await fetch(url);
  const { results, next } = await response.json();
  const people: Person[] = results.map((person: any) => ({
    name: person.name,
    height: person.height,
    mass: person.mass,
  }));

  if (next) {
    const nextPagePeople = await fetchPeopleData(next);
    return [...people, ...nextPagePeople];
  } else {
    return people;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Person[] | { error: string }>
) {
  const searchParams = new URLSearchParams(req.url?.split("?")[1]);
  const sortBy = searchParams.get("sortBy") as SortBy | null;
  let sortKey: SortBy | null = null;

  if (
    sortBy &&
    (sortBy === "height" || sortBy === "mass" || sortBy === "name")
  ) {
    sortKey = sortBy;
  }

  try {
    const people = await fetchPeopleData("https://swapi.dev/api/people/");

    if (sortKey) {
      people.sort((a, b) => compare(a[sortKey!], b[sortKey!]));
    }

    // Set the Cache-Control header to enable client-side and proxy caching for 1 hour
    res.setHeader(
      "Cache-Control",
      `max-age=3600, s-maxage=3600, stale-while-revalidate`
    );
    res.setHeader("Vary", "Accept-Encoding, Cookie, sortBy");
    res.setHeader("Cache-Key", sortKey || "default");
    res.status(200).json(people);
  } catch (error) {
    console.error("Error fetching people data: ", error);
    res.status(500).json({ error: "Error fetching people data." });
  }
}
