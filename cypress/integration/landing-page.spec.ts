describe("Landing page", () => {
  it("Has no detectable a11y violations on load", () => {
    cy.visit("/");
    cy.injectAxe();
    cy.checkA11y();
  });
});
