describe('top nav', () => {
  const baseUrl = (Cypress.config().baseUrl || '').replace(/\/$/, '');

  beforeEach(() => {
    cy.visit('/');
  });

  it('should nav to home page', () => {
    // act
    cy.get('[data-cy="nav-home"]').click();
    // assert
    cy.get('#home').should('exist');
    cy.url().should('eq', baseUrl + '/');
  });

  it('should nav to about page', () => {
    // act
    cy.get('[data-cy="nav-about"]').click();
    // assert
    cy.get('#about').should('exist');
    cy.url().should('eq', baseUrl + '/about');
  });

  it('should nav to product list page', () => {
    // act
    cy.get('[data-cy="nav-product-list"]').click();
    // assert
    cy.get('#product-list').should('exist');
    cy.url().should('eq', baseUrl + '/products');
  });

});
