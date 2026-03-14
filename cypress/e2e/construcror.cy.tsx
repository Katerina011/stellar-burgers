describe('Конструктор бургера', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients.json' });
    cy.intercept('GET', '**/api/auth/user', { fixture: 'user.json' });
    cy.intercept('POST', '**/api/orders', { fixture: 'order.json' });

    cy.window().then((win) => {
      win.localStorage.setItem('accessToken', 'mockAccessToken');
      win.localStorage.setItem('refreshToken', 'mockRefreshToken');
    });
    cy.visit('/');
  });

  it('добавляет ингредиенты в конструктор', () => {
    cy.get('[data-cy="bun"] li').first().find('button').click();
    cy.get('[data-cy="main"] li').first().find('button').click();
    cy.get('[data-cy="order-button"]').should('not.be.disabled');
  });

  it('модальное окно ингредиента', () => {
    cy.get('[data-cy="bun"] li img').first().click({ force: true });
    cy.get('[data-cy="ingredient-modal"]').should('be.visible');
    cy.get('[data-cy="modal-close"]').click({ force: true });
  });

  it('создает заказ', () => {
    cy.get('[data-cy="bun"] li').first().find('button').click();
    cy.get('[data-cy="main"] li').first().find('button').click();
    cy.get('[data-cy="order-button"]').click({ force: true });
    cy.contains('12345', { timeout: 10000 }).should('be.visible');
    cy.get('[data-cy="modal-close"]').click({ force: true });
  });
});
