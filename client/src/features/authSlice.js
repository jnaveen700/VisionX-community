import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Get API URL from environment or use production URL
const API_URL = import.meta.env.VITE_BACKEND_URL 
  ? `${import.meta.env.VITE_BACKEND_URL}/api`
  : 'https://visionx-community-6fmh.onrender.com/api';

console.log('🔐 Auth API_URL:', API_URL);

// Register user
export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      console.log('📝 Register attempt:', { 
        url: `${API_URL}/auth/register`,
        name: userData.name,
        email: userData.email,
        password: userData.password ? '***' : 'MISSING'
      });
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      console.log('✅ Register successful, token received');
      if (response.data) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      console.error('❌ Register failed:', error.response?.data?.msg || error.message);
      console.error('❌ Error details:', error.response?.data);
      return rejectWithValue(error.response?.data?.msg || 'Registration failed');
    }
  }
);

// Login user
export const login = createAsyncThunk(
  'auth/login',
  async (userData, { rejectWithValue }) => {
    console.log('🔐 LOGIN THUNK STARTED');
    console.log('🔐 API_URL being used:', API_URL);
    console.log('🔐 userData:', userData);
    
    try {
      console.log('🔐 About to make axios POST request...');
      const loginUrl = `${API_URL}/auth/login`;
      console.log('🔐 Full login URL:', loginUrl);
      
      const response = await axios.post(loginUrl, userData);
      console.log('✅ Login successful, response:', response.data);
      if (response.data) {
        localStorage.setItem('token', response.data.token);
        console.log('✅ Token saved to localStorage');
        console.log('✅ User data from login response:', response.data.user);
        return {
          token: response.data.token,
          user: response.data.user || null
        };
      }
      return response.data;
    } catch (error) {
      console.error('❌ Login axios error caught');
      console.error('❌ Error response:', error.response);
      console.error('❌ Error message:', error.message);
      return rejectWithValue(error.response?.data?.msg || 'Login failed');
    }
  }
);

// Get current user
export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const config = {
        headers: {
          'x-auth-token': token
        }
      };
      const response = await axios.get(`${API_URL}/auth/me`, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.msg);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: localStorage.getItem('token'),
    isAuthenticated: !!localStorage.getItem('token'),
    loading: false,
    user: null,
    error: null
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.user = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        console.log('⏳ Register pending');
        state.loading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        console.log('✅ Register fulfilled:', action.payload);
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user || null;
      })
      .addCase(register.rejected, (state, action) => {
        console.error('❌ Register rejected:', action.payload);
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(login.pending, (state) => {
        console.log('⏳ Login pending');
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        console.log('✅ Login fulfilled:', { token: action.payload.token ? 'received' : 'missing', user: action.payload.user });
        console.log('✅ Setting state.loading = false');
        console.log('✅ Setting state.isAuthenticated = true');
        console.log('✅ Setting state.token to:', action.payload.token?.substring(0, 20) + '...');
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user || null;
        state.error = null;
        console.log('✅ State updated, new state:', { token: !!state.token, isAuthenticated: state.isAuthenticated, user: !!state.user, loading: state.loading });
      })
      .addCase(login.rejected, (state, action) => {
        console.error('❌ Login rejected:', action.payload);
        state.loading = false;
        state.error = action.payload || 'Login failed';
      })
      .addCase(getCurrentUser.pending, (state) => {
        console.log('⏳ GetCurrentUser pending');
        state.loading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        console.log('✅ GetCurrentUser fulfilled');
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        console.error('❌ GetCurrentUser rejected:', action.payload);
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
