import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchProducts = createAsyncThunk(
  'product/fetchProducts',
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/products', { params });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'product/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/products/${id}`);
      return data.product;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const addReview = createAsyncThunk(
  'product/addReview',
  async ({ productId, reviewData }, { rejectWithValue }) => {
    try {
      await api.post(`/products/${productId}/reviews`, reviewData);
      const { data } = await api.get(`/products/${productId}`);
      return data.product;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

const productSlice = createSlice({
  name: 'product',
  initialState: {
    products:    [],
    product:     null,
    total:       0,
    totalPages:  1,
    loading:     false,
    error:       null,
  },
  reducers: {
    clearProduct: (state) => { state.product = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading    = false;
        state.products   = action.payload.products;
        state.total      = action.payload.total;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false; state.error = action.payload;
      })
      .addCase(fetchProductById.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false; state.product = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false; state.error = action.payload;
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.product = action.payload;
      });
  },
});

export const { clearProduct } = productSlice.actions;
export default productSlice.reducer;
