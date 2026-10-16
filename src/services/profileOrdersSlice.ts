import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getOrdersApi } from '@utils/burger-api';

import type { RootState } from './store';
import type { TOrder } from '@utils-types';

type TProfileOrdersState = {
  orders: TOrder[];
  isLoading: boolean;
  error: string | null;
};

const initialState: TProfileOrdersState = {
  orders: [],
  isLoading: false,
  error: null,
};

export const fetchProfileOrders = createAsyncThunk<
  TOrder[],
  void,
  { rejectValue: string }
>('profileOrders/fetch', async (_, { rejectWithValue }) => {
  try {
    return await getOrdersApi();
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

const profileOrdersSlice = createSlice({
  name: 'profileOrders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfileOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProfileOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchProfileOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Не удалось загрузить историю заказов';
      });
  },
});

export const selectProfileOrders = (state: RootState): TOrder[] =>
  state.profileOrders.orders;
export const selectProfileOrdersLoading = (state: RootState): boolean =>
  state.profileOrders.isLoading;
export const selectProfileOrdersError = (state: RootState): string | null =>
  state.profileOrders.error;

export default profileOrdersSlice.reducer;
