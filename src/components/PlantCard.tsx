import { Plant } from "../types";
import React from "react";
import { H2, Paragraph } from "../ui/Typography";
import { Tag } from "../ui/Tag";

interface Props {
  plant: Plant;
}

export const PlantCard: React.FC<Props> = ({ plant }) => (
  <article className="rounded shadow-lg max-w-sm">
    <img
      className="w-full object-cover h-48"
      src={plant.imageUrl}
      alt={plant.name}
    />
    <section className="p-4">
      <H2>{plant.name}</H2>
      {plant.description && <Paragraph>{plant.description}</Paragraph>}
      <div className="pt-4 pb-2">
        <Tag title={`Vann hver ${plant.waterIntervalInDays}. dag `} />
        <Tag title={`Sist vannet: ${plant.daysSinceWatered} dager siden `} />
        <Tag title={`Herdingssone: ${plant.hZone}`} />
      </div>
    </section>
  </article>
);
