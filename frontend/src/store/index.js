import { configureStore } from '@reduxjs/toolkit';
import rcaReducer from './rcaSlice';
import uiReducer from './uiSlice';

export const store = configureStore({
  reducer: {
    rca: rcaReducer,
    ui: uiReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});
