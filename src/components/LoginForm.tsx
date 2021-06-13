import * as React from "react";
import { useForm } from "react-hook-form";
import { H1 } from "../ui/Typography";
import { SubmitButton } from "../ui/Button";
import { SimpleErrorMessage } from "../ui/SimpleErrorMessage";
import { ErrorMessage } from "@hookform/error-message";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

interface LoginForm {
  email: string;
  password: string;
}

export const LoginForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors }, setFocus } = useForm<LoginForm>();
  const [serverError, setServerError] = useState<string>();
  const history = useHistory();

  useEffect(() => {
    setFocus("email");
  }, [setFocus]);

  const onSubmit = async (data: LoginForm) => {
    const res = await fetch('/login', {
      method: 'post',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      const json = await res.json();
      setServerError(json.message);
    } else {
      setServerError(undefined);
      history.push("/")
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-6 text-white grid grid-flow-row gap-2 rounded-lg bg-green-700"
      >
        <H1>Logg inn</H1>

        <label htmlFor="email">E-post</label>
        <input
          type="email"
          data-testid="email"
          className="p-2 text-black"
          {...register("email", { required: "E-post er påkrevd" })}
        />
        <ErrorMessage
          name="email"
          errors={errors}
          render={({ message }) => <SimpleErrorMessage>{message}</SimpleErrorMessage>}
        />

        <label htmlFor="password">Passord</label>
        <input
          type="password"
          data-testid="password"
          className="p-2 text-black"
          {...register(
            "password",
            { required: "Passord er påkrevd", minLength: { value: 8, message: "Passordet må være minst 8 tegn" } }
            )
          }
        />
        <ErrorMessage
          name="password"
          errors={errors}
          render={({ message }) => {
            return <SimpleErrorMessage>{message}</SimpleErrorMessage>;
          }}
        />
        <SubmitButton>Logg inn</SubmitButton>
        {serverError && <SimpleErrorMessage>{serverError}</SimpleErrorMessage>}
      </form>
    </>
  );
}
