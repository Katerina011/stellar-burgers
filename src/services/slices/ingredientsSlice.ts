import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TIngredient, RequestStatus } from '@utils-types';
import { getIngredientsApi } from '@api';

export interface IIngredientsState {
  ingredients: TIngredient[];
  requestStatus: RequestStatus;
  error: string | null;
}

const initialState: IIngredientsState = {
  ingredients: [],
  requestStatus: RequestStatus.Idle,
  error: null
};

export const fetchIngredients = createAsyncThunk<TIngredient[], void>(
  'ingredients/fetchIngredients',
  async () => {
    try {
      const ingredients = await getIngredientsApi();
      return ingredients;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Ошибка загрузки ингредиентов';
      throw new Error(message);
    }
  }
);

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  selectors: {
    selectIng: (state: IIngredientsState) => state.ingredients,
    selectIngStatus: (state: IIngredientsState) => state.requestStatus,
    selectIngError: (state: IIngredientsState) => state.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.requestStatus = RequestStatus.Loading;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.requestStatus = RequestStatus.Success;
        state.ingredients = action.payload;
        state.error = null;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.requestStatus = RequestStatus.Failed;
        if (action.error?.message) {
          state.error = action.error.message;
        } else {
          state.error = 'Ошибка загрузки ингредиентов';
        }
      });
  }
});

export const { selectIng, selectIngStatus, selectIngError } =
  ingredientsSlice.selectors;

export default ingredientsSlice.reducer;
