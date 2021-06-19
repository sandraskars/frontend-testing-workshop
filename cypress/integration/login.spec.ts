import { LoginPage } from "./pages/LoginPage";

// Denne bruker vi ikke i starten av oppgavene, men etterhvert. Uncomment når du ser på abstraksjons-delen av README
// const loginPage = new LoginPage();

describe("Login", () => {
  const successUser = {
    email: "success@mail.com",
    password: "hemmelig",
  };

  it("should show validation error if password is less than 8 characters", () => {});

  it("should show error message if we get a 500 error response", () => {});

  it("should login and be redirected to front page", () => {});

  it("Has no detectable a11y violations on load", () => {});
});
