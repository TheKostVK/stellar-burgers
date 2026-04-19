import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';

interface UserState {
  isInit: boolean;
  isLoading: boolean;
  user: TUser;
}

const initialState: UserState = {
  isInit: true,
  isLoading: false,
  user: {
    name: '',
    email: ''
  }
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    init: (state) => {
      state.isInit = true;
    }
  }
});

export const { init } = userSlice.actions;
export const reducer = userSlice.reducer;
