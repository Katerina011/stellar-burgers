import { describe, expect, test, beforeEach } from '@jest/globals';
import burgerConstructorReducer, {
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  clearConstructor
} from './burgerConstructorSlice';
import { TIngredient, TConstructorIngredient } from '@utils-types';

// ДОРОГОМУ РЕВЬЮЕРУ: объекты не одинаковые у начинок и соуса в данном тесте дополнительное поле id,
// а в тесте с ингредиентами такого поля нет, совпадает только булочка, обязательно нужно выносить
// одинокую булочку в константу?
const mockBun: TIngredient = {
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
};

const mockMain: TConstructorIngredient = {
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
  image_large: 'https://code.s3.yandex.net/react/code/meat-02-large.png',
  id: 'main-1'
};

const mockSauce: TConstructorIngredient = {
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
  image_large: 'https://code.s3.yandex.net/react/code/sauce-03-large.png',
  id: 'sauce-1'
};

let state: { bun: TIngredient | null; ingredients: TConstructorIngredient[] };

// Инициализируем начальное состояние перед каждым тестом
beforeEach(() => {
  state = { bun: null, ingredients: [] };
});

describe('burgerConstructor reducer', () => {
  test('добавляет ингредиент', () => {
    state = burgerConstructorReducer(state, addIngredient(mockMain));
    expect(state.ingredients).toEqual([mockMain]);
  });

  test('удаляет ингредиент по id', () => {
    state = burgerConstructorReducer(state, addIngredient(mockMain));
    state = burgerConstructorReducer(state, addIngredient(mockSauce));
    state = burgerConstructorReducer(state, removeIngredient('main-1'));
    expect(state.ingredients).toEqual([mockSauce]);
  });

  test('не удаляет булку по _id', () => {
    state.bun = mockBun;
    state = burgerConstructorReducer(state, removeIngredient(mockBun._id));
    expect(state.bun).toEqual(mockBun);
  });

  test('перемещает ингредиент вверх', () => {
    state = burgerConstructorReducer(state, addIngredient(mockMain));
    state = burgerConstructorReducer(state, addIngredient(mockSauce));
    state = burgerConstructorReducer(state, moveIngredientUp(1));
    expect(state.ingredients).toEqual([mockSauce, mockMain]);
  });

  test('перемещает ингредиент вниз', () => {
    state = burgerConstructorReducer(state, addIngredient(mockSauce));
    state = burgerConstructorReducer(state, addIngredient(mockMain));
    state = burgerConstructorReducer(state, moveIngredientDown(0));
    expect(state.ingredients).toEqual([mockMain, mockSauce]);
  });

  test('сохраняет булку при операциях с ингредиентами', () => {
    state.bun = mockBun;
    state = burgerConstructorReducer(state, addIngredient(mockMain));
    expect(state.bun).toEqual(mockBun);
  });

  test('игнорирует удаление несуществующего ингредиента', () => {
    state = burgerConstructorReducer(state, removeIngredient('unknown'));
    expect(state.ingredients).toEqual([]);
  });

  test('clearConstructor сбрасывает состояние', () => {
    state = { bun: mockBun, ingredients: [mockMain, mockSauce] };
    state = burgerConstructorReducer(state, clearConstructor());
    expect(state).toEqual({ bun: null, ingredients: [] });
  });
});
