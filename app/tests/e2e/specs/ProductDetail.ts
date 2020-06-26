describe('/products', () => {
  const baseUrl = (Cypress.config().baseUrl || '').replace(/\/$/, '');

  const PAGE_SIZE = 20; // FRAGILE: api/routes/products#PAGE_SIZE

  beforeEach(() => {
    cy.visit('/products');
  });

  it('should visit the product list page', () => {
    // assert
    cy.get('#product-list').should('exist');
    cy.url().should('eq', baseUrl + '/products');
    cy.get('[data-cy="c-product-list"]').should('exist');
  });

  it('should show a list of products', () => {
    // assert
    cy.get('[data-cy="product-detail-card"]').should('have.length.greaterThan', 0);
    cy.get('[data-cy="product-detail-card"]').should('not.have.length.greaterThan', PAGE_SIZE);
  });

  it('should navigate to the first product detail', () => {
    // act
    cy.get('[data-cy="product-link"]').first().click(); // click first product link on detail page
    // assert
    cy.url().should('contain', baseUrl + '/product/');
    cy.get('[data-cy="c-product-detail"]').should('exist');
  });

});
