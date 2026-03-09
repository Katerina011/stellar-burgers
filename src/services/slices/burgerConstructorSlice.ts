import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient, TConstructorIngredient } from '@utils-types';

export interface BurgerConstructorState {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
}

const initialState: BurgerConstructorState = {
  bun: null,
  ingredients: []
};

const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    setBun: (state, action: PayloadAction<TIngredient>) => {
      state.bun = action.payload;
    },

    addIngredient: (state, action: PayloadAction<TConstructorIngredient>) => {
      state.ingredients.push(action.payload);
    },

    removeIngredient: (state, action: PayloadAction<string>) => {
      if (state.bun && state.bun._id === action.payload) {
        return;
      }
      state.ingredients = state.ingredients.filter(
        (ing) => ing.id !== action.payload
      );
    },

    moveIngredientUp: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index > 0) {
        const movedItem = state.ingredients.splice(index, 1)[0];
        state.ingredients.splice(index - 1, 0, movedItem);
      }
    },

    moveIngredientDown: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index < state.ingredients.length - 1) {
        const movedItem = state.ingredients.splice(index, 1)[0];
        state.ingredients.splice(index + 1, 0, movedItem);
      }
    },

    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    }
  },

  selectors: {
    selectBun: (state: BurgerConstructorState) => state.bun,
    selectIngredients: (state: BurgerConstructorState) => state.ingredients,
    selectConstructorItems: (state: BurgerConstructorState) => ({
      bun: state.bun,
      ingredients: state.ingredients
    })
  }
});

export const {
  setBun,
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  clearConstructor
} = burgerConstructorSlice.actions;

export const { selectBun, selectIngredients, selectConstructorItems } =
  burgerConstructorSlice.selectors;

export default burgerConstructorSlice.reducer;
