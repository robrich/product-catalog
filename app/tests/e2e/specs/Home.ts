describe('/', () => {
  const baseUrl = (Cypress.config().baseUrl || '').replace(/\/$/, '');
  it('should visit the home page', () => {
    // act
    cy.visit('/');
    // assert
    cy.get('#home').should('exist');
    cy.url().should('eq', baseUrl + '/');
  });
});
