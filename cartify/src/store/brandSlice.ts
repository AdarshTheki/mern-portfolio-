/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { axios } from '../utils';
import type { BrandType } from '../types/Brand';

export const fetchBrands = createAsyncThunk(
  'brands/fetchBrands',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/brand`);
      return response?.data?.data?.docs as BrandType[];
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

interface InitialStateProp {
  items: BrandType[];
  loading: boolean;
  error: null | string;
}

const initialState: InitialStateProp = { items: [], loading: false, error: null };

const brandSlice = createSlice({
  name: 'brands',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBrands.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBrands.fulfilled, (state, action: PayloadAction<BrandType[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchBrands.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || 'internal server error';
      });
  },
});

export default brandSlice.reducer;
