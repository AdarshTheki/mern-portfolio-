import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { axios } from '../utils';
import type { AddressType } from '../types/Address';

interface AddressState {
  items: AddressType[];
  loading: boolean;
  error: string | null;
}

const initialState: AddressState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchAddresses = createAsyncThunk(
  'addresses/fetchAddresses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/address`);
      return response?.data?.data as AddressType[];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    addAddress: (state, action: PayloadAction<AddressType>) => {
      state.items = action.payload.isDefault
        ? [...state.items.map((i) => ({ ...i, isDefault: false })), action.payload]
        : [...state.items, action.payload];
    },

    removeAddress: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => i._id !== action.payload);
    },

    updateAddress: (state, action: PayloadAction<AddressType>) => {
      const item = action.payload;
      state.items = item.isDefault
        ? state.items.map((i) => (i._id === item._id ? item : { ...i, isDefault: false }))
        : state.items.map((i) => (i._id === item._id ? item : i));
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchAddresses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAddresses.fulfilled, (state, action: PayloadAction<AddressType[]>) => {
        state.loading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || action.error.message || 'Failed to fetch addresses';
      });
  },
});

export const { addAddress, updateAddress, removeAddress } = addressSlice.actions;
export default addressSlice.reducer;
