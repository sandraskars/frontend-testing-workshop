export class LoginPage {
  visit(): LoginPage {
    cy.visit("/login");
    return this;
  }

  getEmailInput(): Cypress.Chainable<unknown> {
    return cy.getBySelector("email");
  }

  getPasswordInput(): Cypress.Chainable<unknown> {
    return cy.getBySelector("password");
  }

  getError(): Cypress.Chainable<unknown> {
    return cy.getBySelector("error");
  }

  typeEmail(value: string): LoginPage {
    this.getEmailInput().type(value);
    return this;
  }

  typePassword(value: string): LoginPage {
    this.getPasswordInput().type(value);
    return this;
  }

  clickLoginButton(): LoginPage {
    cy.getBySelector("submit").click();
    return this;
  }
}
