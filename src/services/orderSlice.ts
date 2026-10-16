import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getOrderByNumberApi, orderBurgerApi } from '@utils/burger-api';

import type { RootState } from './store';
import type { TOrder } from '@utils-types';

type TOrderState = {
  orderRequest: boolean;
  orderModalData: TOrder | null;
  currentOrder: TOrder | null;
  currentOrderLoading: boolean;
  error: string | null;
};

const initialState: TOrderState = {
  orderRequest: false,
  orderModalData: null,
  currentOrder: null,
  currentOrderLoading: false,
  error: null,
};

export const createOrderThunk = createAsyncThunk<
  TOrder,
  string[],
  { rejectValue: string }
>('order/create', async (ingredientIds, { rejectWithValue }) => {
  try {
    const response = await orderBurgerApi(ingredientIds);
    return response.order;
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

export const fetchOrderByNumber = createAsyncThunk<
  TOrder,
  number,
  { rejectValue: string }
>('order/fetchByNumber', async (number, { rejectWithValue }) => {
  try {
    const response = await getOrderByNumberApi(number);
    const order = response.orders[0];
    if (!order) {
      return rejectWithValue('Заказ не найден');
    }
    return order;
  } catch (error) {
    return rejectWithValue((error as Error).message);
  }
});

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.orderModalData = null;
      state.error = null;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrderThunk.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(createOrderThunk.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
      })
      .addCase(createOrderThunk.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.payload ?? 'Не удалось оформить заказ';
      })

      .addCase(fetchOrderByNumber.pending, (state) => {
        state.currentOrderLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.currentOrderLoading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.currentOrderLoading = false;
        state.error = action.payload ?? 'Не удалось загрузить заказ';
      });
  },
});

export const { clearOrder, clearCurrentOrder } = orderSlice.actions;

export const selectOrderRequest = (state: RootState): boolean =>
  state.order.orderRequest;
export const selectOrderModalData = (state: RootState): TOrder | null =>
  state.order.orderModalData;
export const selectCurrentOrder = (state: RootState): TOrder | null =>
  state.order.currentOrder;
export const selectCurrentOrderLoading = (state: RootState): boolean =>
  state.order.currentOrderLoading;
export const selectOrderError = (state: RootState): string | null => state.order.error;

export default orderSlice.reducer;
