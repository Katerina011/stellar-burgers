import { describe, expect, test } from '@jest/globals';
import ordersReducer, {
  fetchOrders,
  createOrder,
  fetchOrderByNumber,
  setOrderModal,
  clearOrderModal,
  resetOrders,
  OrdersState
} from './ordersSlice';
import type { TOrder } from '@utils-types';

// Мокируем все API, используемые в слайсе
jest.mock('@api', () => ({
  getOrdersApi: jest.fn(),
  orderBurgerApi: jest.fn(),
  getOrderByNumberApi: jest.fn()
}));

const mockOrders: TOrder[] = [
  {
    _id: '69b32f1ea64177001b32f6a4',
    status: 'done',
    name: 'Био-марсианский бургер',
    createdAt: '2026-03-12T21:24:46.390Z',
    updatedAt: '2026-03-12T21:24:46.643Z',
    number: 102806,
    ingredients: ['643d69a5c3f7b9001cfa093d', '643d69a5c3f7b9001cfa093e']
  }
];

const mockOrder: TOrder = {
  _id: '69b32f1ea64177001b32f6a5',
  status: 'pending',
  name: 'Космический бургер',
  createdAt: '2026-03-13T10:00:00.000Z',
  updatedAt: '2026-03-13T10:00:00.000Z',
  number: 102807,
  ingredients: ['643d69a5c3f7b9001cfa0941']
};

const mockCreateOrderResponse = {
  order: mockOrder,
  name: 'Космический бургер'
};

describe('ordersSlice', () => {
  const initialState: OrdersState = {
    ordersAll: [],
    orderModal: null,
    isLoading: false,
    error: null
  };

  let mockGetOrdersApi: jest.Mock;
  let mockOrderBurgerApi: jest.Mock;
  let mockGetOrderByNumberApi: jest.Mock;

  beforeAll(() => {
    mockGetOrdersApi = require('@api').getOrdersApi;
    mockOrderBurgerApi = require('@api').orderBurgerApi;
    mockGetOrderByNumberApi = require('@api').getOrderByNumberApi;
  });

  beforeEach(() => jest.clearAllMocks());

  test('начальное состояние корректно', () => {
    const state = ordersReducer(undefined, { type: 'unknown' });
    expect(state).toEqual(initialState);
  });

  describe('fetchOrders', () => {
    test('pending: isLoading = true, ошибка сброшена', () => {
      const action = { type: fetchOrders.pending.type };
      const state = ordersReducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
      expect(state.ordersAll).toEqual(initialState.ordersAll);
    });

    test('fulfilled: данные сохранены, isLoading = false', async () => {
      mockGetOrdersApi.mockResolvedValue(mockOrders);

      const dispatch = jest.fn();
      await fetchOrders()(dispatch, jest.fn(), undefined);

      const fulfilledAction = dispatch.mock.calls[1][0];
      const state = ordersReducer(initialState, fulfilledAction);

      expect(state.isLoading).toBe(false);
      expect(state.ordersAll).toEqual(mockOrders);
      expect(state.error).toBeNull();
    });

    test('rejected: ошибка сохранена, isLoading = false', async () => {
      const errorMessage = 'Ошибка загрузки заказов';
      mockGetOrdersApi.mockRejectedValue(new Error(errorMessage));

      const dispatch = jest.fn();
      await fetchOrders()(dispatch, jest.fn(), undefined);

      const rejectedAction = dispatch.mock.calls[1][0];
      const state = ordersReducer(initialState, rejectedAction);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.ordersAll).toEqual(initialState.ordersAll);
    });
  });

  describe('createOrder', () => {
    test('pending: isLoading = true, ошибка сброшена', () => {
      const action = { type: createOrder.pending.type };
      const state = ordersReducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
      expect(state.orderModal).toBeNull();
    });

    test('fulfilled: orderModal обновлён, isLoading = false', async () => {
      mockOrderBurgerApi.mockResolvedValue(mockCreateOrderResponse);

      const dispatch = jest.fn();
      const ingredientsIds = ['643d69a5c3f7b9001cfa093d'];
      await createOrder(ingredientsIds)(dispatch, jest.fn(), undefined);

      const fulfilledAction = dispatch.mock.calls[1][0];
      const state = ordersReducer(initialState, fulfilledAction);

      expect(state.isLoading).toBe(false);
      expect(state.orderModal).toEqual(mockOrder);
      expect(state.error).toBeNull();
    });

    test('rejected: ошибка сохранена, isLoading = false', async () => {
      const errorMessage = 'Ошибка создания заказа';
      mockOrderBurgerApi.mockRejectedValue(new Error(errorMessage));

      const dispatch = jest.fn();
      const ingredientsIds = ['643d69a5c3f7b9001cfa093d'];
      await createOrder(ingredientsIds)(dispatch, jest.fn(), undefined);

      const rejectedAction = dispatch.mock.calls[1][0];
      const state = ordersReducer(initialState, rejectedAction);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.orderModal).toBeNull();
    });
  });

  describe('fetchOrderByNumber', () => {
    test('pending: isLoading = true, ошибка сброшена', () => {
      const action = { type: fetchOrderByNumber.pending.type };
      const state = ordersReducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
      expect(state.orderModal).toBeNull();
    });

    test('fulfilled: orderModal обновлён, isLoading = false', async () => {
      const orderNumber = 102808;
      mockGetOrderByNumberApi.mockResolvedValue({ orders: [mockOrder] });

      const dispatch = jest.fn();
      await fetchOrderByNumber(orderNumber)(dispatch, jest.fn(), undefined);

      const fulfilledAction = dispatch.mock.calls[1][0];
      const state = ordersReducer(initialState, fulfilledAction);

      expect(state.isLoading).toBe(false);
      expect(state.orderModal).toEqual(mockOrder);
      expect(state.error).toBeNull();
    });

    test('rejected: ошибка сохранена, isLoading = false', async () => {
      const orderNumber = 99999;
      const errorMessage = 'Ошибка загрузки заказа';
      mockGetOrderByNumberApi.mockRejectedValue(new Error(errorMessage));

      const dispatch = jest.fn();
      await fetchOrderByNumber(orderNumber)(dispatch, jest.fn(), undefined);

      const rejectedAction = dispatch.mock.calls[1][0];
      const state = ordersReducer(initialState, rejectedAction);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.orderModal).toBeNull();
    });
  });

  describe('reducers', () => {
    describe('setOrderModal', () => {
      test('устанавливает orderModal в переданное значение', () => {
        const action = setOrderModal(mockOrder);
        const state = ordersReducer(initialState, action);

        expect(state.orderModal).toEqual(mockOrder);
        expect(state.ordersAll).toEqual(initialState.ordersAll);
        expect(state.isLoading).toBe(false);
        expect(state.error).toBeNull();
      });

      test('устанавливает orderModal в null', () => {
        let state = ordersReducer(initialState, setOrderModal(mockOrder));
        expect(state.orderModal).toEqual(mockOrder);

        const action = setOrderModal(null);
        state = ordersReducer(state, action);

        expect(state.orderModal).toBeNull();
        expect(state.ordersAll).toEqual(initialState.ordersAll);
      });
    });

    describe('clearOrderModal', () => {
      test('сбрасывает orderModal в null', () => {
        const preState = { ...initialState, orderModal: mockOrder };

        const action = clearOrderModal();
        const state = ordersReducer(preState, action);

        expect(state.orderModal).toBeNull();
        expect(state.ordersAll).toEqual(initialState.ordersAll);
        expect(state.isLoading).toBe(false);
        expect(state.error).toBeNull();
      });
    });

    describe('resetOrders', () => {
      test('сбрасывает ordersAll в пустой массив и очищает ошибку', () => {
        const preState: OrdersState = {
          ordersAll: mockOrders,
          orderModal: mockOrder,
          isLoading: true,
          error: 'Какая‑то ошибка'
        };

        const action = resetOrders();
        const state = ordersReducer(preState, action);

        expect(state.ordersAll).toEqual([]);
        expect(state.error).toBeNull();
        // Проверяем, что другие поля не изменились
        expect(state.orderModal).toEqual(preState.orderModal);
        expect(state.isLoading).toEqual(preState.isLoading);
      });
    });
  });
});
