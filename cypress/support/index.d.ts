/// <reference types="Cypress" />

declare namespace Cypress {
  interface Chainable {
    getBySelector(selector: string): Chainable
  }
}
