import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';

console.log('📦 Creating Redux store...');

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

console.log('✅ Redux store created successfully');

export default store;
