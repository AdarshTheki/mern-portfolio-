import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import categorySlice from './categorySlice';
import brandSlice from './brandSlice';
import productSlice from './productSlice';
import cartSlice from './cartSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    categories: categorySlice,
    brands: brandSlice,
    carts: cartSlice,
    products: productSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
