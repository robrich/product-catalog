describe('/about', () => {
  const baseUrl = (Cypress.config().baseUrl || '').replace(/\/$/, '');
  it('should visit the about page', () => {
    // act
    cy.visit('/about');
    // assert
    cy.get('#about').should('exist');
    cy.url().should('eq', baseUrl + '/about');
  });
});
