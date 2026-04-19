import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import type { RootState } from '../store';
import {
  getUserApi,
  loginUserApi,
  logoutApi,
  refreshToken,
  registerUserApi,
  TLoginData,
  TRegisterData
} from '@api';
import { deleteCookie, getCookie, setCookie } from '../../utils/cookie';

export const initUser = createAsyncThunk(
  'auth/initUser',
  async () => {
    const hasRefreshToken = Boolean(localStorage.getItem('refreshToken'));
    const hasAccessToken = Boolean(getCookie('accessToken'));

    if (!hasRefreshToken && !hasAccessToken) {
      return null;
    }

    try {
      if (hasRefreshToken && !hasAccessToken) {
        await refreshToken();
      }

      const response = await getUserApi();

      return response.user;
    } catch {
      return null;
    }
  },
  {
    condition: (_, { getState }) => {
      const { userSlice } = getState() as RootState;

      return (
        !userSlice.isInit &&
        !userSlice.isLoading &&
        userSlice.user === undefined
      );
    }
  }
);

export const loginUser = createAsyncThunk('auth/login', (data: TLoginData) =>
  loginUserApi(data)
);

export const registerUser = createAsyncThunk(
  'auth/register',
  (data: TRegisterData) => registerUserApi(data)
);

export const logoutUser = createAsyncThunk('auth/logout', () => logoutApi());

const clearAuth = (state: UserState) => {
  localStorage.removeItem('refreshToken');
  deleteCookie('accessToken');
  state.user = null;
};

const setAuth = (
  state: UserState,
  payload: { user: TUser; accessToken: string; refreshToken: string }
) => {
  state.user = payload.user;
  setCookie('accessToken', payload.accessToken);
  localStorage.setItem('refreshToken', payload.refreshToken);
};

interface UserState {
  isInit: boolean;
  isLoading: boolean;
  user: TUser | null | undefined;
  error: string | null;
}

const initialState: UserState = {
  isInit: false,
  isLoading: false,
  user: undefined,
  error: null
};

export const userSlice = createSlice({
  name: 'userSlice',
  initialState,
  reducers: {},
  selectors: {
    getUser: (state) => state.user,
    getAuthStatus: (state) => state.isLoading,
    getIsAuthInit: (state) => state.isInit
  },
  extraReducers: (builder) => {
    builder
      .addCase(initUser.pending, (state) => {
        state.isInit = false;
        state.isLoading = true;
        state.user = undefined;
        state.error = null;
      })
      .addCase(initUser.fulfilled, (state, action) => {
        state.isInit = true;
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(initUser.rejected, (state) => {
        state.isInit = true;
        state.isLoading = false;
        clearAuth(state);
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isInit = true;
        state.isLoading = false;
        setAuth(state, action.payload);
      })
      .addCase(loginUser.rejected, (state) => {
        state.isInit = true;
        state.isLoading = false;
        clearAuth(state);
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isInit = true;
        state.isLoading = false;
        setAuth(state, action.payload);
      })
      .addCase(registerUser.rejected, (state) => {
        state.isInit = true;
        state.isLoading = false;
        clearAuth(state);
      })
      .addCase(logoutUser.pending, (state) => {
        state.isInit = true;
        clearAuth(state);
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isInit = true;
        clearAuth(state);
      })
      .addCase(logoutUser.rejected, (state) => {
        state.isInit = true;
        clearAuth(state);
      });
  }
});

export const { getUser, getAuthStatus, getIsAuthInit } = userSlice.selectors;
