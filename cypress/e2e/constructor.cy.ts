describe('конструктор бургера', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
    cy.intercept('GET', '**/orders/all', { fixture: 'orders.json' }).as(
      'getFeedOrders'
    );
  });

  afterEach(() => {
    cy.clearCookie('accessToken');
    cy.clearLocalStorage();
  });

  it('добавляет булку и начинку в конструктор', () => {
    cy.visit('/');
    cy.wait('@getIngredients');

    cy.get('[data-cy="add-ingredient-643d69a5c3f7b9001cfa093d"]')
      .find('button')
      .click();
    cy.get('[data-cy="add-ingredient-643d69a5c3f7b9001cfa0941"]')
      .find('button')
      .click();

    cy.get('[data-cy="burger-constructor"]').within(() => {
      cy.contains('Флюоресцентная булка R2-D3 (верх)').should('exist');
      cy.contains('Флюоресцентная булка R2-D3 (низ)').should('exist');
      cy.contains('Биокотлета из марсианской Магнолии').should('exist');
      cy.contains('2400').should('exist');
    });
  });

  it('открывает модалку с данными выбранного ингредиента и закрывает ее по крестику', () => {
    cy.visit('/');
    cy.wait('@getIngredients');

    cy.get('[data-cy="ingredient-link-643d69a5c3f7b9001cfa0941"]').click();

    cy.get('[data-cy="modal"]').within(() => {
      cy.contains('Биокотлета из марсианской Магнолии').should('exist');
      cy.contains('4242').should('exist');
      cy.contains('420').should('exist');
    });

    cy.get('[data-cy="modal-close"]').click();
    cy.get('[data-cy="modal"]').should('not.exist');
  });

  it('закрывает модалку ингредиента по клику на оверлей', () => {
    cy.visit('/');
    cy.wait('@getIngredients');

    cy.get('[data-cy="ingredient-link-643d69a5c3f7b9001cfa0942"]').click();
    cy.get('[data-cy="modal"]').should('contain', 'Соус Spicy-X');

    cy.get('[data-cy="modal-overlay"]').click({ force: true });
    cy.get('[data-cy="modal"]').should('not.exist');
  });

  it('создает заказ и очищает конструктор после закрытия модального окна', () => {
    cy.setCookie('accessToken', 'Bearer test-access-token');
    cy.intercept('GET', '**/auth/user', { fixture: 'user.json' }).as('getUser');
    cy.intercept('POST', '**/orders', { fixture: 'order.json' }).as(
      'createOrder'
    );
    cy.intercept('GET', '**/orders', { fixture: 'orders.json' }).as(
      'getUserOrders'
    );

    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.setItem('refreshToken', 'test-refresh-token');
      }
    });
    cy.wait('@getIngredients');
    cy.wait('@getUser');

    cy.get('[data-cy="add-ingredient-643d69a5c3f7b9001cfa093d"]')
      .find('button')
      .click();
    cy.get('[data-cy="add-ingredient-643d69a5c3f7b9001cfa0941"]')
      .find('button')
      .click();
    cy.get('[data-cy="add-ingredient-643d69a5c3f7b9001cfa0942"]')
      .find('button')
      .click();

    cy.get('[data-cy="order-button"]').click();
    cy.wait('@createOrder');

    cy.get('[data-cy="modal"]').within(() => {
      cy.get('[data-cy="order-number"]').should('have.text', '77777');
      cy.contains('идентификатор заказа').should('exist');
    });

    cy.get('[data-cy="modal-close"]').click();
    cy.get('[data-cy="modal"]').should('not.exist');
    cy.get('[data-cy="constructor-empty-bun-top"]').should(
      'contain',
      'Выберите булки'
    );
    cy.get('[data-cy="constructor-empty-bun-bottom"]').should(
      'contain',
      'Выберите булки'
    );
    cy.get('[data-cy="constructor-empty-ingredients"]').should(
      'contain',
      'Выберите начинку'
    );
  });
});
