import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RequestStatus, TUser } from '@utils-types';
import { deleteCookie, setCookie } from '../../utils/cookie';

export interface UserState {
  user: TUser | null;
  isAuthChecked: boolean;
  isAuthenticated: boolean;
  status: RequestStatus;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  isAuthChecked: false,
  isAuthenticated: false,
  status: RequestStatus.Idle,
  error: null
};

export const checkAuth = createAsyncThunk(
  'user/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserApi();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const login = createAsyncThunk(
  'user/login',
  async (userData: TLoginData) => {
    try {
      const response = await loginUserApi(userData);
      setCookie('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      return response;
    } catch (error) {
      console.error('Ошибка входа:', error);
      throw error;
    }
  }
);

export const register = createAsyncThunk(
  'user/register',
  async (userData: TRegisterData) => {
    try {
      const response = await registerUserApi(userData);

      setCookie('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      return response;
    } catch (error) {
      console.error('Ошибка регистрации:', error);
      throw error;
    }
  }
);

export const logout = createAsyncThunk('user/logout', async () => {
  try {
    await logoutApi();
    deleteCookie('accessToken');
    localStorage.removeItem('refreshToken');
  } catch (error) {
    console.error('Ошибка выхода из системы:', error);
    throw error;
  }
});

export const updateUser = createAsyncThunk<TUser, TRegisterData>(
  'user/updateUser',
  async (userData: Partial<TRegisterData>) => {
    try {
      const response = await updateUserApi(userData);
      return response.user;
    } catch (error) {
      console.error('Ошибка обновления данных:', error);
      throw error;
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.status = RequestStatus.Idle;
    },
    setUser: (state, action: PayloadAction<TUser>) => {
      state.user = action.payload;
      state.isAuthChecked = true;
      state.isAuthenticated = true;
      state.status = RequestStatus.Success;
    },
    resetUserState: (state) => {
      state.user = null;
      state.isAuthChecked = false;
      state.isAuthenticated = false;
      state.status = RequestStatus.Idle;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // checkAuth
      .addCase(checkAuth.pending, (state) => {
        state.status = RequestStatus.Loading;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthChecked = true;
        state.isAuthenticated = true;
        state.status = RequestStatus.Success;
        state.error = null;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.isAuthChecked = true;
        state.isAuthenticated = false;
        state.status = RequestStatus.Failed;
        state.error = action.error.message || 'Ошибка проверки авторизации';
      })

      // login
      .addCase(login.pending, (state) => {
        state.status = RequestStatus.Loading;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthChecked = true;
        state.isAuthenticated = true;
        state.status = RequestStatus.Success;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = RequestStatus.Failed;
        state.error = action.error.message || 'Ошибка входа';
        state.isAuthenticated = false;
      })

      // register
      .addCase(register.pending, (state) => {
        state.status = RequestStatus.Loading;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthChecked = true;
        state.isAuthenticated = true;
        state.status = RequestStatus.Success;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = RequestStatus.Failed;
        state.error = action.error.message || 'Ошибка регистрации';
      })

      // logout
      .addCase(logout.pending, (state) => {
        state.status = RequestStatus.Loading;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.status = RequestStatus.Success;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.status = RequestStatus.Failed;
        state.error = action.error.message || 'Ошибка выхода из системы';
      })

      // updateUser
      .addCase(updateUser.pending, (state) => {
        state.status = RequestStatus.Loading;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = RequestStatus.Success;
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.status = RequestStatus.Failed;
        state.error = action.error.message || 'Ошибка обновления данных';
      });
  },
  selectors: {
    userDataSelector: (state: UserState) => state.user,
    isAuthCheckedSelector: (state: UserState) => state.isAuthChecked,
    isAuthenticatedSelector: (state: UserState) => state.isAuthenticated,
    userStatusSelector: (state: UserState) => state.status,
    userErrorSelector: (state: UserState) => state.error
  }
});

export const { clearError, setUser, resetUserState } = userSlice.actions;

export const {
  userDataSelector,
  isAuthCheckedSelector,
  isAuthenticatedSelector,
  userStatusSelector,
  userErrorSelector
} = userSlice.selectors;

export default userSlice.reducer;
