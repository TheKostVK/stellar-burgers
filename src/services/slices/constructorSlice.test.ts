import { TIngredient } from '@utils-types';
import {
  addIngredientToConstructorItems,
  clearConstructorItems,
  constructorSlice,
  ingredientsInit,
  moveIngredientInConstructorItems,
  removeIngredientFromConstructorItems
} from './constructorSlice';

const bun: TIngredient = {
  _id: 'bun-id',
  name: 'Флюоресцентная булка R2-D3',
  type: 'bun',
  proteins: 44,
  fat: 26,
  carbohydrates: 85,
  calories: 643,
  price: 988,
  image: 'bun.png',
  image_large: 'bun-large.png',
  image_mobile: 'bun-mobile.png'
};

const main: TIngredient = {
  _id: 'main-id',
  name: 'Биокотлета из марсианской Магнолии',
  type: 'main',
  proteins: 420,
  fat: 142,
  carbohydrates: 242,
  calories: 4242,
  price: 424,
  image: 'main.png',
  image_large: 'main-large.png',
  image_mobile: 'main-mobile.png'
};

const sauce: TIngredient = {
  _id: 'sauce-id',
  name: 'Соус Spicy-X',
  type: 'sauce',
  proteins: 30,
  fat: 20,
  carbohydrates: 40,
  calories: 30,
  price: 90,
  image: 'sauce.png',
  image_large: 'sauce-large.png',
  image_mobile: 'sauce-mobile.png'
};

describe('constructorSlice reducer', () => {
  it('добавляет булку в конструктор и считает ее цену дважды', () => {
    const state = constructorSlice.reducer(
      undefined,
      addIngredientToConstructorItems(bun)
    );

    expect(state.constructorItems.bun).toEqual({
      ...bun,
      id: expect.any(String)
    });
    expect(state.constructorItems.price).toBe(1976);
  });

  it('добавляет начинку в конструктор', () => {
    const state = constructorSlice.reducer(
      undefined,
      addIngredientToConstructorItems(main)
    );

    expect(state.constructorItems.ingredients).toEqual([
      { ...main, id: expect.any(String) }
    ]);
    expect(state.constructorItems.price).toBe(424);
  });

  it('удаляет начинку из конструктора', () => {
    const stateWithMain = constructorSlice.reducer(
      undefined,
      addIngredientToConstructorItems(main)
    );
    const [constructorMain] = stateWithMain.constructorItems.ingredients;

    const state = constructorSlice.reducer(
      stateWithMain,
      removeIngredientFromConstructorItems(constructorMain)
    );

    expect(state.constructorItems.ingredients).toEqual([]);
    expect(state.constructorItems.price).toBe(0);
  });

  it('меняет порядок ингредиентов в начинке', () => {
    const stateWithMain = constructorSlice.reducer(
      undefined,
      addIngredientToConstructorItems(main)
    );
    const stateWithSauce = constructorSlice.reducer(
      stateWithMain,
      addIngredientToConstructorItems(sauce)
    );

    const state = constructorSlice.reducer(
      stateWithSauce,
      moveIngredientInConstructorItems({ fromIndex: 0, toIndex: 1 })
    );

    expect(state.constructorItems.ingredients.map((item) => item._id)).toEqual([
      'sauce-id',
      'main-id'
    ]);
  });

  it('очищает конструктор', () => {
    const stateWithBun = constructorSlice.reducer(
      undefined,
      addIngredientToConstructorItems(bun)
    );
    const stateWithMain = constructorSlice.reducer(
      stateWithBun,
      addIngredientToConstructorItems(main)
    );

    const state = constructorSlice.reducer(
      stateWithMain,
      clearConstructorItems()
    );

    expect(state.constructorItems).toEqual({
      price: 0,
      bun: null,
      ingredients: []
    });
  });
});

describe('constructorSlice async ingredients actions', () => {
  it('переводит загрузку ингредиентов в состояние ожидания', () => {
    const state = constructorSlice.reducer(
      undefined,
      ingredientsInit.pending('request-id')
    );

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
    expect(state.ingredients).toEqual([]);
  });

  it('записывает ингредиенты при успешной загрузке', () => {
    const state = constructorSlice.reducer(
      undefined,
      ingredientsInit.fulfilled([bun, main, sauce], 'request-id')
    );

    expect(state.isLoading).toBe(false);
    expect(state.ingredients).toEqual([bun, main, sauce]);
    expect(state.buns).toEqual([bun]);
    expect(state.mains).toEqual([main]);
    expect(state.sauces).toEqual([sauce]);
  });

  it('записывает ошибку при неудачной загрузке', () => {
    const state = constructorSlice.reducer(
      undefined,
      ingredientsInit.rejected(new Error('Ошибка загрузки'), 'request-id')
    );

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка загрузки');
  });
});
