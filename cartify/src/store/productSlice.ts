import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axios } from '../utils';
import type { ProductType } from '../types/Product';

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/product?limit=50`);
      return response?.data?.data?.docs as ProductType[];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

interface InitialStateProp {
  items: ProductType[];
  loading: boolean;
  error: null | string;
}

const initialState: InitialStateProp = {
  items: [],
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        return { ...state, loading: true };
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        return { ...state, loading: false, items: action.payload };
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        return { ...state, loading: false, error: action.error.message || 'Internal server error' };
      });
  },
});

export default productSlice.reducer;
