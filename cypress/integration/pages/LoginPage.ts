export class LoginPage {
  visit() {
    cy.visit("/login");
    return this;
  }

  getEmailInput() {
    return cy.getBySelector("email");
  }

  getPasswordInput() {
    return cy.getBySelector("password");
  }

  getError() {
    return cy.getBySelector("error");
  }

  typeEmail(value: string) {
    this.getEmailInput().type(value);
    return this;
  }

  typePassword(value: string) {
    this.getPasswordInput().type(value);
    return this;
  }

  clickLoginButton() {
    cy.getBySelector("submit").click();
    return this;
  }
}
