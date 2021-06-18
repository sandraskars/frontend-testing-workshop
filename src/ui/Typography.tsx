import * as React from "react";

export const H1: React.FC = ({ children }) => (
  <h1 className="text-3xl mb-2">{children}</h1>
);

export const H2: React.FC = ({ children }) => (
  <h2 className="text-2xl mb-2">{children}</h2>
);

export const Paragraph: React.FC = ({ children }) => (
  <p className="text-l mb-8">{children}</p>
);
