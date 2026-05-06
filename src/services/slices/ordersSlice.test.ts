import { TOrder } from '@utils-types';
import {
  clearOrderModalData,
  createOrder,
  fetchFeedOrders,
  fetchOrderByNumber,
  fetchUserOrders,
  ordersSlice
} from './ordersSlice';

const order: TOrder = {
  _id: 'order-id',
  status: 'done',
  name: 'Флюоресцентный бургер',
  createdAt: '2026-05-06T09:00:00.000Z',
  updatedAt: '2026-05-06T09:00:00.000Z',
  number: 77777,
  ingredients: ['bun-id', 'main-id', 'bun-id']
};

const newOrder = {
  _id: 'new-order-id',
  status: 'done',
  name: 'Флюоресцентный бургер',
  owner: {
    name: 'Тестовый пользователь',
    email: 'test@example.com',
    createdAt: '2026-05-06T09:00:00.000Z',
    updatedAt: '2026-05-06T09:00:00.000Z'
  },
  createdAt: '2026-05-06T09:00:00.000Z',
  updatedAt: '2026-05-06T09:00:00.000Z',
  number: 77777,
  price: 2400
};

describe('ordersSlice feed actions', () => {
  it('выставляет флаг загрузки ленты заказов', () => {
    const state = ordersSlice.reducer(
      undefined,
      fetchFeedOrders.pending('request-id')
    );

    expect(state.feed.isLoading).toBe(true);
    expect(state.feed.error).toBeNull();
  });

  it('записывает заказы ленты при успешном запросе', () => {
    const state = ordersSlice.reducer(
      undefined,
      fetchFeedOrders.fulfilled(
        { orders: [order], total: 10, totalToday: 2 },
        'request-id'
      )
    );

    expect(state.feed.isLoading).toBe(false);
    expect(state.feed.orders).toEqual([order]);
    expect(state.feed.total).toBe(10);
    expect(state.feed.totalToday).toBe(2);
  });

  it('записывает ошибку ленты при неудачном запросе', () => {
    const state = ordersSlice.reducer(undefined, {
      type: fetchFeedOrders.rejected.type,
      payload: 'Ошибка ленты',
      error: { message: 'Rejected' },
      meta: { aborted: false }
    });

    expect(state.feed.isLoading).toBe(false);
    expect(state.feed.error).toBe('Ошибка ленты');
  });
});

describe('ordersSlice user orders actions', () => {
  it('выставляет флаг загрузки заказов пользователя', () => {
    const state = ordersSlice.reducer(
      undefined,
      fetchUserOrders.pending('request-id')
    );

    expect(state.user.isLoading).toBe(true);
    expect(state.user.error).toBeNull();
  });

  it('записывает заказы пользователя при успешном запросе', () => {
    const state = ordersSlice.reducer(
      undefined,
      fetchUserOrders.fulfilled([order], 'request-id')
    );

    expect(state.user.isLoading).toBe(false);
    expect(state.user.orders).toEqual([order]);
  });

  it('записывает ошибку заказов пользователя', () => {
    const state = ordersSlice.reducer(undefined, {
      type: fetchUserOrders.rejected.type,
      payload: 'Ошибка заказов',
      error: { message: 'Rejected' },
      meta: { aborted: false }
    });

    expect(state.user.isLoading).toBe(false);
    expect(state.user.error).toBe('Ошибка заказов');
  });
});

describe('ordersSlice order details actions', () => {
  it('запоминает номер заказа при начале загрузки деталей', () => {
    const state = ordersSlice.reducer(
      undefined,
      fetchOrderByNumber.pending('request-id', 77777)
    );

    expect(state.orderByNumber.isLoading).toBe(true);
    expect(state.orderByNumber.requestedNumber).toBe(77777);
  });

  it('записывает найденный заказ', () => {
    const state = ordersSlice.reducer(
      undefined,
      fetchOrderByNumber.fulfilled(order, 'request-id', 77777)
    );

    expect(state.orderByNumber.isLoading).toBe(false);
    expect(state.orderByNumber.order).toEqual(order);
    expect(state.orderByNumber.requestedNumber).toBe(77777);
  });

  it('записывает ошибку загрузки деталей заказа', () => {
    const state = ordersSlice.reducer(undefined, {
      type: fetchOrderByNumber.rejected.type,
      payload: 'Заказ не найден',
      error: { message: 'Rejected' },
      meta: { aborted: false, arg: 77777 }
    });

    expect(state.orderByNumber.isLoading).toBe(false);
    expect(state.orderByNumber.error).toBe('Заказ не найден');
    expect(state.orderByNumber.requestedNumber).toBe(77777);
  });
});

describe('ordersSlice create order actions', () => {
  it('выставляет флаг создания заказа', () => {
    const state = ordersSlice.reducer(
      undefined,
      createOrder.pending('request-id', ['bun-id'])
    );

    expect(state.orderRequest).toBe(true);
    expect(state.createOrderError).toBeNull();
  });

  it('записывает данные созданного заказа', () => {
    const state = ordersSlice.reducer(
      undefined,
      createOrder.fulfilled({ order: newOrder }, 'request-id', ['bun-id'])
    );

    expect(state.orderRequest).toBe(false);
    expect(state.orderModalData).toEqual(newOrder);
  });

  it('очищает данные модалки заказа', () => {
    const stateWithOrder = ordersSlice.reducer(
      undefined,
      createOrder.fulfilled({ order: newOrder }, 'request-id', ['bun-id'])
    );

    const state = ordersSlice.reducer(stateWithOrder, clearOrderModalData());

    expect(state.orderModalData).toBeNull();
  });

  it('записывает ошибку создания заказа', () => {
    const state = ordersSlice.reducer(undefined, {
      type: createOrder.rejected.type,
      payload: 'Ошибка создания заказа',
      error: { message: 'Rejected' },
      meta: { aborted: false }
    });

    expect(state.orderRequest).toBe(false);
    expect(state.createOrderError).toBe('Ошибка создания заказа');
  });
});
