import { describe, expect, test } from '@jest/globals';
import userReducer, {
  checkAuth,
  login,
  register,
  logout,
  updateUser,
  clearError,
  setUser,
  resetUserState,
  initialState
} from './userSlice';
import { RequestStatus } from '@utils-types';

jest.mock('@api', () => ({
  getUserApi: jest.fn(),
  loginUserApi: jest.fn(),
  registerUserApi: jest.fn(),
  logoutApi: jest.fn(),
  updateUserApi: jest.fn()
}));

jest.mock('./../../utils/cookie', () => ({
  setCookie: jest.fn(),
  deleteCookie: jest.fn()
}));

const mockUser = { email: 'test@example.com', name: 'Test User' };

describe('userSlice', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // SYNCHRONOUS REDUCERS
  test('clearError: сбрасывает ошибку и статус', () => {
    const state = { ...initialState, error: 'error', status: RequestStatus.Loading };
    const newState = userReducer(state, clearError());
    expect(newState.error).toBeNull();
    expect(newState.status).toBe(RequestStatus.Idle);
  });

  test('setUser: устанавливает пользователя и авторизацию', () => {
    const state = initialState;
    const newState = userReducer(state, setUser(mockUser));
    expect(newState.user).toEqual(mockUser);
    expect(newState.isAuthChecked).toBe(true);
    expect(newState.isAuthenticated).toBe(true);
    expect(newState.status).toBe(RequestStatus.Success);
  });

  test('resetUserState: сбрасывает состояние', () => {
    const state = {
      ...initialState,
      user: mockUser,
      isAuthChecked: true,
      isAuthenticated: true,
      status: RequestStatus.Loading,
      error: 'error'
    };
    const newState = userReducer(state, resetUserState());
    expect(newState).toEqual(initialState);
  });

  // CHECK AUTH
  test('checkAuth.pending: устанавливает статус Loading', () => {
    const action = { type: checkAuth.pending.type };
    const state = userReducer(initialState, action);
    expect(state.status).toBe(RequestStatus.Loading);
  });

  test('checkAuth.fulfilled: устанавливает пользователя и авторизацию', () => {
    const action = {
      type: checkAuth.fulfilled.type,
      payload: { user: mockUser }
    };
    const state = userReducer(initialState, action);
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthChecked).toBe(true);
    expect(state.isAuthenticated).toBe(true);
    expect(state.status).toBe(RequestStatus.Success);
    expect(state.error).toBeNull();
  });

  test('checkAuth.rejected: isAuthChecked=true, ошибка, не авторизован', () => {
    const action = {
      type: checkAuth.rejected.type,
      error: { message: 'Ошибка проверки' }
    };
    const state = userReducer(initialState, action);
    expect(state.isAuthChecked).toBe(true);
    expect(state.isAuthenticated).toBe(false);
    expect(state.status).toBe(RequestStatus.Failed);
    expect(state.error).toBe('Ошибка проверки');
  });

  // LOGIN
  test('login.pending: статус Loading, ошибка сброшена', () => {
    const state = { ...initialState, error: 'old error' };
    const action = { type: login.pending.type };
    const newState = userReducer(state, action);
    expect(newState.status).toBe(RequestStatus.Loading);
    expect(newState.error).toBeNull();
  });

  test('login.fulfilled: авторизует пользователя', () => {
    const action = {
      type: login.fulfilled.type,
      payload: { user: mockUser }
    };
    const state = userReducer(initialState, action);
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthChecked).toBe(true);
    expect(state.isAuthenticated).toBe(true);
    expect(state.status).toBe(RequestStatus.Success);
  });

  test('login.rejected: ошибка, не авторизован', () => {
    const action = {
      type: login.rejected.type,
      error: { message: 'Ошибка входа' }
    };
    const state = userReducer(initialState, action);
    expect(state.status).toBe(RequestStatus.Failed);
    expect(state.error).toBe('Ошибка входа');
    expect(state.isAuthenticated).toBe(false);
  });

  // REGISTER
  test('register.pending: статус Loading', () => {
    const action = { type: register.pending.type };
    const state = userReducer(initialState, action);
    expect(state.status).toBe(RequestStatus.Loading);
  });

  test('register.fulfilled: регистрирует и авторизует', () => {
    const action = {
      type: register.fulfilled.type,
      payload: { user: mockUser }
    };
    const state = userReducer(initialState, action);
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthenticated).toBe(true);
    expect(state.status).toBe(RequestStatus.Success);
  });

  test('register.rejected: устанавливает ошибку', () => {
    const action = {
      type: register.rejected.type,
      error: { message: 'Ошибка регистрации' }
    };
    const state = userReducer(initialState, action);
    expect(state.status).toBe(RequestStatus.Failed);
    expect(state.error).toBe('Ошибка регистрации');
  });

  // LOGOUT
  test('logout.pending: статус Loading', () => {
    const action = { type: logout.pending.type };
    const state = userReducer(initialState, action);
    expect(state.status).toBe(RequestStatus.Loading);
  });

  test('logout.fulfilled: сбрасывает авторизацию', () => {
    const state = { ...initialState, user: mockUser, isAuthenticated: true };
    const action = { type: logout.fulfilled.type };
    const newState = userReducer(state, action);
    expect(newState.user).toBeNull();
    expect(newState.isAuthenticated).toBe(false);
    expect(newState.status).toBe(RequestStatus.Success);
    expect(newState.error).toBeNull();
  });

  test('logout.rejected: устанавливает ошибку', () => {
    const action = {
      type: logout.rejected.type,
      error: { message: 'Ошибка выхода' }
    };
    const state = userReducer(initialState, action);
    expect(state.status).toBe(RequestStatus.Failed);
    expect(state.error).toBe('Ошибка выхода');
  });

  // UPDATE USER
  test('updateUser.pending: статус Loading', () => {
    const action = { type: updateUser.pending.type };
    const state = userReducer(initialState, action);
    expect(state.status).toBe(RequestStatus.Loading);
  });

  test('updateUser.fulfilled: обновляет пользователя', () => {
    const updatedUser = { ...mockUser, name: 'Updated User' };
    const action = {
      type: updateUser.fulfilled.type,
      payload: updatedUser
    };
    const state = userReducer({ ...initialState, user: mockUser }, action);
    expect(state.user).toEqual(updatedUser);
    expect(state.status).toBe(RequestStatus.Success);
  });

  test('updateUser.rejected: устанавливает ошибку', () => {
    const action = {
      type: updateUser.rejected.type,
      error: { message: 'Ошибка обновления' }
    };
    const state = userReducer(initialState, action);
    expect(state.status).toBe(RequestStatus.Failed);
    expect(state.error).toBe('Ошибка обновления');
  });
});