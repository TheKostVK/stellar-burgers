import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getFeedsApi, orderBurgerApi, TNewOrder } from '@api';
import { TOrder } from '@utils-types';

export const ordersInit = createAsyncThunk('orders/init', getFeedsApi);
export const createOrder = createAsyncThunk('orders/create', (data: string[]) =>
  orderBurgerApi(data)
);

interface OrderSliceState {
  isLoading: boolean;
  orders: TOrder[];
  total: number;
  totalToday: number;
  error: string | null;

  orderRequest: boolean;
  orderModalData: TNewOrder | null;
}

const initialState: OrderSliceState = {
  isLoading: true,
  orders: [],
  total: 0,
  totalToday: 0,
  error: null,
  orderRequest: false,
  orderModalData: null
};

export const ordersSlice = createSlice({
  name: 'ordersSlice',
  initialState,
  reducers: {
    clearOrderModalData: (state) => {
      state.orderModalData = null;
    }
  },
  selectors: {
    getOrders: (state) => state.orders,
    getFeeds: (state) => state,
    getOrdersStatus: (state) => state.isLoading,
    getOrderRequest: (state) => state.orderRequest,
    getOrderModalData: (state) => state.orderModalData,
    getOrderById: (state, orderNumber: number) =>
      state.orders.find((order) => order.number === orderNumber)
  },
  extraReducers: (builder) => {
    builder
      .addCase(ordersInit.pending, (state) => {
        state.isLoading = true;
        state.orders = [];
        state.total = 0;
        state.totalToday = 0;
        state.error = null;
      })
      .addCase(ordersInit.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(ordersInit.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.orderRequest = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderRequest = false;
        state.orderModalData = action.payload.order;
      })
      .addCase(createOrder.rejected, (state) => {
        state.isLoading = false;
        state.orderRequest = false;
      });
  }
});

export const { clearOrderModalData } = ordersSlice.actions;
export const {
  getOrders,
  getFeeds,
  getOrdersStatus,
  getOrderRequest,
  getOrderModalData,
  getOrderById
} = ordersSlice.selectors;
