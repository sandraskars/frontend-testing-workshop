describe("Landing page", () => {
  it("Has no detectable a11y violations on load", () => {
    cy.visit("/");
    cy.injectAxe();
    cy.checkA11y();
  });

  it("If plants are fetched successfully, should show list", () => {
    cy.intercept(
      { method: "GET", url: "/plants" },
      { fixture: "plants.json" },
    ).as("plants");

    cy.visit("/");
    cy.wait("@plants");

    // Check that number of plant-cards equal number of entries in plants.json
    cy.getBySelector("plant-card").should("have.length", 5);
  });

  it("If an error happens during plant request, an error message should be shown", () => {
    cy.intercept(
      {
        method: "GET",
        url: "/plants",
      },
      {
        statusCode: 500,
        body: {
          message: "Dette klarte vi ikke :/",
        },
      },
    ).as("plants");

    cy.visit("/");
    cy.wait("@plants");

    cy.getBySelector("error").contains("Dette klarte vi ikke :/");
  });

  it("Should show a spinner when fetching plants", () => {
    cy.intercept(
      { method: "GET", url: "/plants" },
      { fixture: "plants.json", delay: 1000 },
    ).as("plants");

    cy.visit("/");
    cy.getBySelector("spinner").should("exist");
    cy.wait("@plants");
    cy.getBySelector("spinner").should("not.exist");
  });

  it("Should show plants that matches the search only", () => {
    cy.intercept(
      { method: "GET", url: "/plants" },
      { fixture: "plants.json" },
    ).as("plants");

    cy.visit("/");
    cy.wait("@plants");

    cy.getBySelector("search-input").type("monstera");
    cy.getBySelector("plant-card").should("have.length", 1);
    cy.getBySelector("search-input").clear();
    cy.getBySelector("search-input").type("ra");
    cy.getBySelector("plant-card").should("have.length", 2);
  });
});
