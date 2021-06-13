import { selector } from "./utils";

export class LoginPage {
  chain: Cypress.Chainable<unknown> = cy;

  visit() {
    this.chain = this.chain.visit('/login');
    return this;
  }

  getEmailInput() {
    this.chain = this.chain.get(selector('email'));
    return this.chain;
  }

  getPasswordInput() {
    this.chain = this.chain.get(selector('password'));
    return this.chain;
  }

  typeEmail(value: string) {
    this.chain = this.getEmailInput().type(value);
    return this;
  }

  typePassword(value: string) {
    this.chain = this.getPasswordInput().type(value);
    return this;
  }

  clickLoginButton() {
    this.chain = this.chain.get(selector('submit')).click();
    return this;
  }
}
