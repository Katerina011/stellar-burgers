const BUN_SELECTOR = '[data-cy="bun"] li';
const MAIN_SELECTOR = '[data-cy="main"] li';
const INGREDIENT_IMG = `${BUN_SELECTOR} img`;
const ORDER_BUTTON = '[data-cy="order-button"]';
const INGREDIENT_MODAL = '[data-cy="ingredient-modal"]';
const MODAL_CLOSE = '[data-cy="modal-close"]';

describe('Конструктор бургера', () => {
  beforeEach(() => {
    cy.window().then((win) => {
      win.localStorage.setItem('accessToken', 'mockAccessToken');
      win.localStorage.setItem('refreshToken', 'mockRefreshToken');
    });
    
    cy.setCookie('accessToken', 'mockAccessToken');
    
    cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients.json' });
    cy.intercept('GET', '**/api/auth/user', { fixture: 'user.json' });
    cy.intercept('POST', '**/api/orders', { fixture: 'order.json' });
    
    cy.visit('/');
  });

  afterEach(() => {
    cy.window().then((win) => {
      win.localStorage.clear();
    });
    cy.clearCookies();
  });

  it('добавляет ингредиенты в конструктор', () => {
    cy.get(BUN_SELECTOR).first().find('button').click();
    cy.get(MAIN_SELECTOR).first().find('button').click();
    cy.get(ORDER_BUTTON).should('not.be.disabled');
  });

  it('модальное окно ингредиента', () => {
    cy.get(INGREDIENT_IMG).first().click({ force: true });
    cy.get(INGREDIENT_MODAL).should('be.visible');
    cy.get(MODAL_CLOSE).click({ force: true });
  });

  it('создает заказ', () => {
    cy.get(BUN_SELECTOR).first().find('button').click();
    cy.get(MAIN_SELECTOR).first().find('button').click();
    
    cy.get(ORDER_BUTTON).click({ force: true });
    cy.contains('12345', { timeout: 10000 }).should('be.visible');
    
    cy.get(MODAL_CLOSE).click({ force: true });
  });
});