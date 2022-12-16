import { configureStore } from '@reduxjs/toolkit';
import sessionReducer from './sessionSlice';

export const store = configureStore({
    reducer: {
        session: sessionReducer,
    }
});
