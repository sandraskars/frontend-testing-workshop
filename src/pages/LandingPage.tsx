import * as React from "react";
import { H1 } from "../ui/Typography";
import { PlantSearchResult } from "../components/PlantSearchResult";
import { plants } from "../data/plants";
import { useState } from "react";
import { Plant } from "../types";

export const LandingPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState<Plant[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);

    const result = plants.filter((plant) =>
      plant.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    setSearchResult(result);
  };

  return (
    <>
      <section className="grid grid-rows-3 p-6 justify-center gap-4">
        <H1>Velkommen til plantesøk 👋🏻🌿</H1>
        <input
          type="text"
          placeholder="Søk etter planter"
          onChange={handleChange}
        />
      </section>
      <PlantSearchResult result={searchResult} />
    </>
  );
};
