import { configureStore } from '@reduxjs/toolkit';
import authReducer    from './slices/authSlice';
import cartReducer    from './slices/cartSlice';
import productReducer from './slices/productSlice';

const store = configureStore({
  reducer: {
    auth:    authReducer,
    cart:    cartReducer,
    product: productReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export default store;
