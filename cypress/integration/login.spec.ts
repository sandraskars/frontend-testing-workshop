import { LoginPage } from "./pages/LoginPage";

const page = new LoginPage();

describe("Login", () => {
  it("should focus on email input field on render", () => {
    page.visit().getEmailInput().should('be.focused')
  })

  it("should login and be redirected to front page", () => {
    const successUser = {email: "success@mail.com", password: "hemmelig"}
    page.visit()
      .typeEmail(successUser.email)
      .typePassword(successUser.password)
      .clickLoginButton();

    cy.url().should('eq', `${Cypress.config().baseUrl}/`);
  })
})
