import * as React from "react";
import { Plant } from "../types";
import { PlantCard } from "./PlantCard";

interface Props {
  result: Plant[];
}

export function PlantSearchResult({ result }: Props): JSX.Element {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 m-4">
      {result.map((plant) => (
        <PlantCard key={plant.id} plant={plant} />
      ))}
    </section>
  );
}
