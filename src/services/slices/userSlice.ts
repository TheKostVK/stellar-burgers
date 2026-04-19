import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import type { RootState } from '../store';
import {
  getUserApi,
  loginUserApi,
  logoutApi,
  refreshToken,
  registerUserApi,
  updateUserApi,
  TLoginData,
  TRegisterData
} from '@api';
import { deleteCookie, getCookie, setCookie } from '../../utils/cookie';

const getErrorMessage = (error: unknown) =>
  (error as { message?: string })?.message || 'Ошибка запроса';

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

export const loginUser = createAsyncThunk<
  { user: TUser; accessToken: string; refreshToken: string },
  TLoginData,
  { rejectValue: string }
>('auth/login', async (data, { rejectWithValue }) => {
  try {
    return await loginUserApi(data);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const registerUser = createAsyncThunk<
  { user: TUser; accessToken: string; refreshToken: string },
  TRegisterData,
  { rejectValue: string }
>('auth/register', async (data, { rejectWithValue }) => {
  try {
    return await registerUserApi(data);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const updateUser = createAsyncThunk<
  { user: TUser },
  Partial<TRegisterData>,
  { rejectValue: string }
>('auth/updateUser', async (data, { rejectWithValue }) => {
  try {
    return await updateUserApi(data);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});

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
  reducers: {
    forceLogout: (state) => {
      state.isInit = true;
      state.isLoading = false;
      state.error = null;
      clearAuth(state);
    }
  },
  selectors: {
    getUser: (state) => state.user,
    getAuthStatus: (state) => state.isLoading,
    getIsAuthInit: (state) => state.isInit,
    getAuthError: (state) => state.error
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
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isInit = true;
        state.isLoading = false;
        setAuth(state, action.payload);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isInit = true;
        state.isLoading = false;
        clearAuth(state);
        state.error = action.payload || action.error.message || 'Ошибка входа';
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isInit = true;
        state.isLoading = false;
        setAuth(state, action.payload);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isInit = true;
        state.isLoading = false;
        clearAuth(state);
        state.error =
          (action.payload as string) ||
          action.error.message ||
          'Ошибка регистрации';
      })
      .addCase(logoutUser.pending, (state) => {
        state.isInit = true;
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isInit = true;
        state.isLoading = false;
        clearAuth(state);
      })
      .addCase(logoutUser.rejected, (state) => {
        state.isInit = true;
        state.isLoading = false;
        clearAuth(state);
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) ||
          action.error.message ||
          'Не удалось обновить профиль';
      });
  }
});

export const { getUser, getAuthStatus, getIsAuthInit, getAuthError } =
  userSlice.selectors;
export const { forceLogout } = userSlice.actions;
