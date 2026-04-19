import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { getFeedsApi } from '@api';

export const ordersInit = createAsyncThunk('orders/all', () => getFeedsApi());

interface OrderSliceState {
  isLoading: boolean;
  orders: TOrder[];
}

const initialState: OrderSliceState = {
  isLoading: true,
  orders: []
};

export const orderSlice = createSlice({
  name: 'orderSlice',
  initialState,
  reducers: {},
  selectors: {
    getOrders: (state) => state.orders,
    getOrdersStatus: (state) => state.isLoading
  },
  extraReducers: (builder) => {
    builder
      .addCase(ordersInit.pending, (state) => {
        state.isLoading = true;
        state.orders = [];
      })
      .addCase(ordersInit.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
      })
      .addCase(ordersInit.rejected, (state) => {
        state.isLoading = false;
        state.orders = [];
      });
  }
});

export const { getOrders, getOrdersStatus } = orderSlice.selectors;
