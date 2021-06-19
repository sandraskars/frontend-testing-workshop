import * as React from "react";
import { H1 } from "../ui/Typography";
import { PlantSearchResult } from "../components/PlantSearchResult";
import { useEffect, useState } from "react";
import { Plant } from "../types";
import { SimpleErrorMessage } from "../ui/SimpleErrorMessage";

export const LandingPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [plants, setPlants] = useState<Plant[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    async function fetchPlants() {
      try {
        setIsFetching(true);
        const res = await fetch("/plants");
        const json = await res.json();
        if (res.ok) {
          setPlants(json);
        } else {
          setError(json);
        }
      } catch (e) {
        setError(e);
      } finally {
        setIsFetching(false);
      }
    }

    void fetchPlants();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const results = plants.filter((plant) =>
    plant.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <>
      <section className="grid grid-rows-3 p-6 justify-center gap-4">
        <H1>Velkommen til plantesøk 👋🏻🌿</H1>
        <input
          type="text"
          className="bg-white"
          placeholder="Søk etter planter"
          onChange={handleChange}
          data-testid="search-input"
        />
      </section>
      {isFetching && <span data-testid="spinner">Laster...</span>}
      {error ? (
        <SimpleErrorMessage>{error.message}</SimpleErrorMessage>
      ) : (
        <PlantSearchResult result={results} />
      )}
    </>
  );
};
