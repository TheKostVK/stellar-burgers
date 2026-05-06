import {
  initUser,
  loginUser,
  logoutUser,
  registerUser,
  updateUser,
  userSlice
} from './userSlice';

const user = {
  email: 'test@example.com',
  name: 'Тестовый пользователь'
};

const authPayload = {
  user,
  accessToken: 'Bearer test-access-token',
  refreshToken: 'test-refresh-token'
};

describe('userSlice initUser actions', () => {
  it('выставляет флаг инициализации пользователя', () => {
    const state = userSlice.reducer(undefined, initUser.pending('request-id'));

    expect(state.isInit).toBe(false);
    expect(state.isLoading).toBe(true);
    expect(state.user).toBeUndefined();
    expect(state.error).toBeNull();
  });

  it('записывает пользователя после инициализации', () => {
    const state = userSlice.reducer(
      undefined,
      initUser.fulfilled(user, 'request-id')
    );

    expect(state.isInit).toBe(true);
    expect(state.isLoading).toBe(false);
    expect(state.user).toEqual(user);
  });

  it('сбрасывает пользователя при ошибке инициализации', () => {
    const state = userSlice.reducer(
      undefined,
      initUser.rejected(new Error('Ошибка'), 'request-id')
    );

    expect(state.isInit).toBe(true);
    expect(state.isLoading).toBe(false);
    expect(state.user).toBeNull();
  });
});

describe('userSlice auth actions', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('выставляет флаг входа пользователя', () => {
    const state = userSlice.reducer(
      undefined,
      loginUser.pending('request-id', {
        email: user.email,
        password: 'password'
      })
    );

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('записывает пользователя после успешного входа', () => {
    const state = userSlice.reducer(
      undefined,
      loginUser.fulfilled(authPayload, 'request-id', {
        email: user.email,
        password: 'password'
      })
    );

    expect(state.isInit).toBe(true);
    expect(state.isLoading).toBe(false);
    expect(state.user).toEqual(user);
    expect(localStorage.getItem('refreshToken')).toBe('test-refresh-token');
  });

  it('записывает ошибку входа', () => {
    const state = userSlice.reducer(undefined, {
      type: loginUser.rejected.type,
      payload: 'Ошибка входа',
      error: { message: 'Rejected' }
    });

    expect(state.isInit).toBe(true);
    expect(state.isLoading).toBe(false);
    expect(state.user).toBeNull();
    expect(state.error).toBe('Ошибка входа');
  });

  it('записывает пользователя после регистрации', () => {
    const state = userSlice.reducer(
      undefined,
      registerUser.fulfilled(authPayload, 'request-id', {
        email: user.email,
        name: user.name,
        password: 'password'
      })
    );

    expect(state.isInit).toBe(true);
    expect(state.isLoading).toBe(false);
    expect(state.user).toEqual(user);
  });

  it('очищает пользователя после выхода', () => {
    const loggedInState = userSlice.reducer(
      undefined,
      loginUser.fulfilled(authPayload, 'request-id', {
        email: user.email,
        password: 'password'
      })
    );

    const state = userSlice.reducer(
      loggedInState,
      logoutUser.fulfilled(undefined, 'request-id')
    );

    expect(state.isInit).toBe(true);
    expect(state.isLoading).toBe(false);
    expect(state.user).toBeNull();
  });
});

describe('userSlice updateUser actions', () => {
  it('выставляет флаг обновления пользователя', () => {
    const state = userSlice.reducer(
      undefined,
      updateUser.pending('request-id', { name: 'Новое имя' })
    );

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('записывает обновленного пользователя', () => {
    const updatedUser = { ...user, name: 'Новое имя' };

    const state = userSlice.reducer(
      undefined,
      updateUser.fulfilled({ user: updatedUser }, 'request-id', {
        name: updatedUser.name
      })
    );

    expect(state.isLoading).toBe(false);
    expect(state.user).toEqual(updatedUser);
  });

  it('записывает ошибку обновления пользователя', () => {
    const state = userSlice.reducer(undefined, {
      type: updateUser.rejected.type,
      payload: 'Не удалось обновить профиль',
      error: { message: 'Rejected' }
    });

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Не удалось обновить профиль');
  });
});
