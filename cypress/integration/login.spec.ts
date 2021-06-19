import { LoginPage } from "./pages/LoginPage";

const loginPage = new LoginPage();

describe("Login", () => {
  const successUser = {
    email: "success@mail.com",
    password: "hemmelig",
  };

  it("should show validation error if password is less than 8 characters", () => {
    loginPage
      .visit()
      .typeEmail(successUser.email)
      .getPasswordInput()
      .type("123")
      .blur();

    loginPage
      .getError()
      .should("be.visible")
      .and("have.text", "Passordet må være minst 8 tegn");
  });

  it("should show error message if we get a 500 error response", () => {
    loginPage.visit();

    const error = "Tjenesten er utilgjengelig, prøv på nytt";

    cy.intercept("POST", `${Cypress.config().baseUrl}/login`, {
      statusCode: 500,
      body: {
        message: error,
      },
    });

    loginPage
      .typeEmail(successUser.email)
      .typePassword(successUser.password)
      .clickLoginButton()
      .getError()
      .should("be.visible")
      .and("have.text", error);
  });

  it("should login and be redirected to front page", () => {
  });

  it("Has no detectable a11y violations on load", () => {
  });
});
