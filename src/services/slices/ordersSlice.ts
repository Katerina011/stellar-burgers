import { getOrderByNumberApi, getOrdersApi, orderBurgerApi } from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

export interface OrdersState {
  ordersAll: TOrder[];
  orderModal: TOrder | null;
  isLoading: boolean;
  error: string | null;
}

export const initialState: OrdersState = {
  ordersAll: [],
  orderModal: null,
  isLoading: false,
  error: null
};

export const fetchOrders = createAsyncThunk<TOrder[], void>(
  'orders/fetchOrders',
  async () => {
    try {
      const orders = await getOrdersApi();
      return orders;
    } catch (error) {
      throw error instanceof Error ? error.message : 'Ошибка загрузки заказов';
    }
  }
);

export const createOrder = createAsyncThunk<
  { order: TOrder; name: string },
  string[]
>('orders/createOrder', async (ingredientsIds) => {
  try {
    const orderData = await orderBurgerApi(ingredientsIds);
    return orderData;
  } catch (error) {
    throw error instanceof Error ? error.message : 'Ошибка создания заказа';
  }
});

export const fetchOrderByNumber = createAsyncThunk<TOrder, number>(
  'orders/fetchOrderByNumber',
  async (number) => {
    try {
      const response = await getOrderByNumberApi(number);
      return response.orders[0];
    } catch (error) {
      throw error instanceof Error ? error.message : 'Ошибка загрузки заказа';
    }
  }
);

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrderModal: (state, action: PayloadAction<TOrder | null>) => {
      state.orderModal = action.payload;
    },
    clearOrderModal: (state) => {
      state.orderModal = null;
    },
    resetOrders: (state) => {
      state.ordersAll = [];
      state.error = null;
    }
  },
  selectors: {
    selectOrdersAll: (state: OrdersState) => state.ordersAll,
    selectOrderModal: (state: OrdersState) => state.orderModal,
    selectOrderLoading: (state: OrdersState) => state.isLoading,
    selectError: (state: OrdersState) => state.error
  },
  extraReducers: (builder) => {
    // fetchOrders
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ordersAll = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Неизвестная ошибка';
      })

      // createOrder
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderModal = action.payload.order;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Неизвестная ошибка';
      })

      // fetchOrderByNumber
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderModal = action.payload;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Неизвестная ошибка';
      });
  }
});

export const {
  selectOrdersAll,
  selectOrderModal,
  selectOrderLoading,
  selectError
} = ordersSlice.selectors;

export const { setOrderModal, clearOrderModal, resetOrders } =
  ordersSlice.actions;

export default ordersSlice.reducer;
