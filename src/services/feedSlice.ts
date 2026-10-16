import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getFeedsApi } from '@utils/burger-api';

import type { RootState } from './store';
import type { TOrder, TOrdersData } from '@utils-types';

type TFeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
  error: string | null;
};

const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null,
};

export const fetchFeed = createAsyncThunk<TOrdersData, void, { rejectValue: string }>(
  'feed/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getFeedsApi();
      return {
        orders: response.orders,
        total: response.total,
        totalToday: response.totalToday,
      };
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Не удалось загрузить ленту';
      });
  },
});

export const selectFeedOrders = (state: RootState): TOrder[] => state.feed.orders;
export const selectFeedTotal = (state: RootState): number => state.feed.total;
export const selectFeedTotalToday = (state: RootState): number => state.feed.totalToday;
export const selectFeedLoading = (state: RootState): boolean => state.feed.isLoading;
export const selectFeedError = (state: RootState): string | null => state.feed.error;

export default feedSlice.reducer;
