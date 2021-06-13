import * as React from "react";

export const SimpleErrorMessage: React.FC = ({ children }) => (
  <p className="p-2 text-l mb-8 text-red-600 bg-red-50">{children}</p>
)
