import { rootReducer } from './store';

describe('rootReducer', () => {
  it('возвращает начальное состояние для неизвестного экшена', () => {
    expect(rootReducer(undefined, { type: 'UNKNOWN_ACTION' })).toEqual({
      constructorSlice: {
        isLoading: true,
        error: null,
        ingredients: [],
        buns: [],
        mains: [],
        sauces: [],
        constructorItems: {
          price: 0,
          bun: null,
          ingredients: []
        }
      },
      ordersSlice: {
        feed: {
          isLoading: false,
          error: null,
          orders: [],
          total: 0,
          totalToday: 0
        },
        user: {
          isLoading: false,
          error: null,
          orders: []
        },
        orderByNumber: {
          isLoading: false,
          error: null,
          order: null,
          requestedNumber: null
        },
        orderRequest: false,
        orderModalData: null,
        createOrderError: null
      },
      userSlice: {
        isInit: false,
        isLoading: false,
        user: undefined,
        error: null
      }
    });
  });
});
