import { describe, expect, test } from '@jest/globals';
import feedReducer, { fetchFeed, initialState } from './feedSlice';
import { RequestStatus, TOrder, TOrdersData } from '@utils-types';
// Мокируем API
jest.mock('@api', () => ({
  getFeedsApi: jest.fn()
}));

// Тестовые данные
const mockOrder: TOrder = {
  _id: '69b32f1ea64177001b32f6a4',
  ingredients: [
    '643d69a5c3f7b9001cfa093d',
    '643d69a5c3f7b9001cfa093e',
    '643d69a5c3f7b9001cfa0941',
    '643d69a5c3f7b9001cfa093d'
  ],
  status: 'done',
  name: 'Био-марсианский флюоресцентный люминесцентный бургер',
  createdAt: '2026-03-12T21:24:46.390Z',
  updatedAt: '2026-03-12T21:24:46.643Z',
  number: 102806
};

const mockFeedData: TOrdersData = {
  orders: [mockOrder],
  total: 150,
  totalToday: 12
};

describe('feedSlice', () => {
  const mockGetFeedsApi = require('@api').getFeedsApi;

  beforeEach(() => jest.clearAllMocks());

  test('pending: статус Loading, ошибка сброшена', () => {
    const action = { type: fetchFeed.pending.type };
    const state = feedReducer(initialState, action);
    expect(state.status).toBe(RequestStatus.Loading);
    expect(state.error).toBeNull();
    expect(state.feedData).toEqual(initialState.feedData);
  });

  test('fulfilled: статус Success, данные сохранены', async () => {
    mockGetFeedsApi.mockResolvedValue(mockFeedData);

    const dispatch = jest.fn();
    await fetchFeed()(dispatch, jest.fn(), undefined);

    const fulfilledAction = dispatch.mock.calls[1][0];
    const state = feedReducer(initialState, fulfilledAction);

    expect(state.status).toBe(RequestStatus.Success);
    expect(state.feedData).toEqual(mockFeedData);
    expect(state.error).toBeNull();
  });

  test('rejected: статус Failed, ошибка сохранена', async () => {
    const errorMessage = 'Ошибка загрузки ленты заказов';
    mockGetFeedsApi.mockRejectedValue(new Error(errorMessage));

    const dispatch = jest.fn();
    await fetchFeed()(dispatch, jest.fn(), undefined);

    const rejectedAction = dispatch.mock.calls[1][0];
    const state = feedReducer(initialState, rejectedAction);

    expect(state.status).toBe(RequestStatus.Failed);
    expect(state.error).toBe(errorMessage);
    expect(state.feedData).toEqual(initialState.feedData);
  });
});
