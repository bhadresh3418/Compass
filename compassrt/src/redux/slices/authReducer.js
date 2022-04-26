import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    token: localStorage.getItem('token') || null,
    isAuthenticated: false
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        authenticate: (state, action) =>
        {
            localStorage.setItem('token', action.payload);
            state.token = action.payload;
            state.isAuthenticated = true;
        },
        logout: state =>
        {
            localStorage.clear();
            state.token = null;
            state.isAuthenticated = false;
        }
    },
});
export const { authenticate, logout } = authSlice.actions;

export default authSlice.reducer;