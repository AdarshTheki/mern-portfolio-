/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axios } from '../utils';
import type { CategoryType } from '../types/Category';

export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/category`);
      return response?.data?.data?.docs as CategoryType[];
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

interface InitialStateProp {
  items: CategoryType[];
  loading: boolean;
  error: null | string;
}

const initialState: InitialStateProp = { items: [], loading: false, error: null };

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || 'internal server error';
      });
  },
});

export default categoriesSlice.reducer;
