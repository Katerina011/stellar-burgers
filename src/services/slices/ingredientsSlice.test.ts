import { describe, expect, test } from '@jest/globals';
import { RequestStatus, TIngredient } from '@utils-types';
import ingredientsReducer, { fetchIngredients, IIngredientsState } from './ingredientsSlice';

// Мокируем API
jest.mock('@api', () => ({
  getIngredientsApi: jest.fn()
}));

const mockIngredients: TIngredient[] = [
  {
    _id: '643d69a5c3f7b9001cfa093d',
    name: 'Флюоресцентная булка R2-D3',
    type: 'bun',
    proteins: 44,
    fat: 26,
    carbohydrates: 85,
    calories: 643,
    price: 988,
    image: 'https://code.s3.yandex.net/react/code/bun-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-01-large.png'
  },
  {
    _id: '643d69a5c3f7b9001cfa093f',
    name: 'Мясо бессмертных моллюсков Protostomia',
    type: 'main',
    proteins: 433,
    fat: 244,
    carbohydrates: 33,
    calories: 420,
    price: 1337,
    image: 'https://code.s3.yandex.net/react/code/meat-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-02-large.png'
  },
  {
    _id: '643d69a5c3f7b9001cfa0944',
    name: 'Соус традиционный галактический',
    type: 'sauce',
    proteins: 42,
    fat: 24,
    carbohydrates: 42,
    calories: 99,
    price: 15,
    image: 'https://code.s3.yandex.net/react/code/sauce-03.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/sauce-03-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/sauce-03-large.png'
  }
];

describe('ingredientsSlice', () => {
  const initialState: IIngredientsState = {
    ingredients: [],
    requestStatus: RequestStatus.Idle,
    error: null
  };

  let mockGetIngredientsApi: jest.Mock;

  beforeAll(() => {
    mockGetIngredientsApi = require('@api').getIngredientsApi;
  });

  beforeEach(() => jest.clearAllMocks());

  test('pending: статус Loading, ошибка сброшена', () => {
    const action = { type: fetchIngredients.pending.type };
    const state = ingredientsReducer(initialState, action);

    expect(state.requestStatus).toBe(RequestStatus.Loading);
    expect(state.error).toBeNull();
    expect(state.ingredients).toEqual(initialState.ingredients);
  });

  test('fulfilled: статус Success, ингредиенты сохранены', async () => {
    mockGetIngredientsApi.mockResolvedValue(mockIngredients);

    const dispatch = jest.fn();
    await fetchIngredients()(dispatch, jest.fn(), undefined);

    const fulfilledAction = dispatch.mock.calls[1][0];
    const state = ingredientsReducer(initialState, fulfilledAction);

    expect(state.requestStatus).toBe(RequestStatus.Success);
    expect(state.ingredients).toEqual(mockIngredients);
    expect(state.error).toBeNull();
  });

  test('rejected: статус Failed, ошибка сохранена', async () => {
    const errorMessage = 'Ошибка загрузки ингредиентов';
    mockGetIngredientsApi.mockRejectedValue(new Error(errorMessage));

    const dispatch = jest.fn();
    await fetchIngredients()(dispatch, jest.fn(), undefined);

    const rejectedAction = dispatch.mock.calls[1][0];
    const state = ingredientsReducer(initialState, rejectedAction);

    expect(state.requestStatus).toBe(RequestStatus.Failed);
    expect(state.error).toBe(errorMessage);
    expect(state.ingredients).toEqual(initialState.ingredients);
  });

  test('начальное состояние корректно', () => {
    const state = ingredientsReducer(undefined, { type: 'unknown' });
    expect(state).toEqual(initialState);
  });
});