import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getFeedsApi, getOrdersApi, orderBurgerApi, TNewOrder } from '@api';
import { TOrder } from '@utils-types';
import { forceLogout, logoutUser } from './userSlice';

type TFeedResponse = {
  orders: TOrder[];
  total: number;
  totalToday: number;
};

const getErrorMessage = (error: unknown) =>
  (error as { message?: string })?.message || 'Не удалось выполнить запрос';

export const fetchFeedOrders = createAsyncThunk<
  TFeedResponse,
  void,
  { rejectValue: string }
>('orders/fetchFeed', async (_, { rejectWithValue }) => {
  try {
    return await getFeedsApi();
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const fetchUserOrders = createAsyncThunk<
  TOrder[],
  void,
  { rejectValue: string }
>('orders/fetchUser', async (_, { rejectWithValue }) => {
  try {
    return await getOrdersApi();
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const createOrder = createAsyncThunk<
  { order: TNewOrder },
  string[],
  { rejectValue: string }
>('orders/create', async (data, { rejectWithValue }) => {
  try {
    return await orderBurgerApi(data);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

interface OrdersSourceState {
  isLoading: boolean;
  error: string | null;
  orders: TOrder[];
}

interface OrderSliceState {
  feed: OrdersSourceState & {
    total: number;
    totalToday: number;
  };
  user: OrdersSourceState;
  orderRequest: boolean;
  orderModalData: TNewOrder | null;
  createOrderError: string | null;
}

const initialState: OrderSliceState = {
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
  orderRequest: false,
  orderModalData: null,
  createOrderError: null
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
    getFeedData: (state) => state.feed,
    getFeedOrders: (state) => state.feed.orders,
    getFeedStatus: (state) => state.feed.isLoading,
    getFeedError: (state) => state.feed.error,
    getUserOrders: (state) => state.user.orders,
    getUserOrdersStatus: (state) => state.user.isLoading,
    getUserOrdersError: (state) => state.user.error,
    getOrderRequest: (state) => state.orderRequest,
    getOrderModalData: (state) => state.orderModalData,
    getCreateOrderError: (state) => state.createOrderError,
    getFeedOrderById: (state, orderNumber: number) =>
      state.feed.orders.find((order) => order.number === orderNumber),
    getUserOrderById: (state, orderNumber: number) =>
      state.user.orders.find((order) => order.number === orderNumber)
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeedOrders.pending, (state) => {
        state.feed.isLoading = true;
        state.feed.error = null;
      })
      .addCase(fetchFeedOrders.fulfilled, (state, action) => {
        state.feed.isLoading = false;
        state.feed.orders = action.payload.orders;
        state.feed.total = action.payload.total;
        state.feed.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeedOrders.rejected, (state, action) => {
        state.feed.isLoading = false;
        if (action.meta.aborted) {
          return;
        }
        state.feed.error = action.payload || action.error.message || null;
      })
      .addCase(fetchUserOrders.pending, (state) => {
        state.user.isLoading = true;
        state.user.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.user.isLoading = false;
        state.user.orders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.user.isLoading = false;
        if (action.meta.aborted) {
          return;
        }
        state.user.error = action.payload || action.error.message || null;
      })
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.createOrderError = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload.order;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.createOrderError = action.payload || action.error.message || null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = {
          isLoading: false,
          error: null,
          orders: []
        };
        state.orderRequest = false;
        state.orderModalData = null;
        state.createOrderError = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.user = {
          isLoading: false,
          error: null,
          orders: []
        };
        state.orderRequest = false;
        state.orderModalData = null;
        state.createOrderError = null;
      })
      .addCase(forceLogout, (state) => {
        state.user = {
          isLoading: false,
          error: null,
          orders: []
        };
        state.orderRequest = false;
        state.orderModalData = null;
        state.createOrderError = null;
      });
  }
});

export const { clearOrderModalData } = ordersSlice.actions;
export const {
  getFeedData,
  getFeedOrders,
  getFeedStatus,
  getFeedError,
  getUserOrders,
  getUserOrdersStatus,
  getUserOrdersError,
  getOrderRequest,
  getOrderModalData,
  getCreateOrderError,
  getFeedOrderById,
  getUserOrderById
} = ordersSlice.selectors;
