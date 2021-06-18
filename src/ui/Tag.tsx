import React from "react";

interface Props {
  title: string;
}
export const Tag: React.FC<Props> = ({ title }) => {
  return (
    <span className="inline-block rounded-full bg-green-100 text-green-800 px-3 py-1 text-sm font-semibold mr-2 mb-2">
      {title}
    </span>
  );
};
