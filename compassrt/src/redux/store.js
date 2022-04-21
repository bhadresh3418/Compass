import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authReducer';
export const store = configureStore({
    reducer: {
        auth: authReducer,
    },
});