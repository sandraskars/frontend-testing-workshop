import * as React from "react";
import { H1, Paragraph } from "../ui/Typography";
import { Button } from "../ui/Button";

export const LandingPage: React.FC = () => {
  return (
    <div className="grid grid-flow-row grid-rows-3 p-6 justify-center">
      <H1>Hallo 👋🏻</H1>
      <Paragraph>Her har vi et paragraf.</Paragraph>
      <section className="flex gap-2">
        <Button>Les noe her</Button>
        <Button>Les noe annet her</Button>
      </section>
    </div>
  )
}
