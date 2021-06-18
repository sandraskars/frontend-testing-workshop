//import "cypress-plugin-snapshots/commands";

Cypress.Commands.add("getBySelector", (selector, ...args) => {
  return cy.get(`[data-testid=${selector}]`, ...args);
});
