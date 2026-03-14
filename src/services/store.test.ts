import { describe, expect, test, beforeEach } from '@jest/globals';
import { rootReducer } from './store';

jest.mock('@api');
jest.mock('./../utils/cookie');

describe('rootReducer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('rootReducer(undefined, UNKNOWN_ACTION) возвращает начальное состояние', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
    
    expect(state).toEqual({
      burgerConstructor: expect.any(Object),
      ingredients: expect.any(Object),
      feed: expect.any(Object),
      orders: expect.any(Object),
      user: expect.any(Object)
    });
    
    expect(state.burgerConstructor).not.toBeUndefined();
    expect(state.ingredients).not.toBeUndefined();
    expect(state.feed).not.toBeUndefined();
    expect(state.orders).not.toBeUndefined();
    expect(state.user).not.toBeUndefined();
  });
});
