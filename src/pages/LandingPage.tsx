import * as React from "react";
import { H1, Paragraph } from "../ui/Typography";

export const LandingPage: React.FC = () => {
  return (
    <div className="grid grid-flow-row p-6 justify-center">
      <H1>Hallo 👋🏻</H1>
      <Paragraph>Her har vi et paragraf.</Paragraph>
    </div>
  );
};
