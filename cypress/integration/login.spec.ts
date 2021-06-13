describe("Login", () => {
  it("should focus on email input field on render", () => {
    cy.visit("/login")
      .get("[data-testid=email]").should('be.focused')
  })

  it("should login and be redirected to front page", () => {
    const successUser = {email: "success@mail.com", password: "hemmelig"}
    cy.visit("/login")
      .get("[data-testid=email]")
      .type(successUser.email)
      .get("[data-testid=password]")
      .type(successUser.password)
      .get("[data-testid=submit]")
      .click()
      .url()
      .should("eq", `${Cypress.config().baseUrl}/`)
  })
})
