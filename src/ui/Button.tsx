import * as React from "react";
import { Link } from "react-router-dom";

interface IProps {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const Button: React.FC<IProps> = ({ children, onClick }) => (
  <button className="py-2 px-4 font-semibold text-white rounded-lg shadow-md bg-green-600 hover:bg-green-700"
          onClick={onClick}
  >
    {children}
  </button>
);

export const SubmitButton: React.FC<IProps> = ({ children, onClick }) => (
  <button type="submit"
          className="py-2 px-4 font-semibold text-white rounded-lg shadow-md bg-green-600 hover:bg-green-800"
          onClick={onClick}
          data-testid="submit"
  >
    {children}
  </button>
);

export const LinkButton: React.FC<IProps & {url: string}> = ({ children, url}) => (
  <Link to={url}><a className="btn">{children}</a></Link>
)
