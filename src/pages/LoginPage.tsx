import * as React from "react";
import { LoginForm } from "../components/LoginForm";

export const LoginPage: React.FC = () => {
  return (
    <div className="grid grid-flow-row p-6 justify-center">
      <LoginForm />
    </div>
  )
}
