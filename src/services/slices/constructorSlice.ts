import {
  createAsyncThunk,
  createSlice,
  nanoid,
  PayloadAction
} from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { getIngredientsApi } from '@api';
import { forceLogout, logoutUser } from './userSlice';

export const ingredientsInit = createAsyncThunk('ingredients', () =>
  getIngredientsApi()
);

interface ConstructorSliceState {
  isLoading: boolean;
  error: string | null;
  ingredients: TIngredient[];
  buns: TIngredient[];
  mains: TIngredient[];
  sauces: TIngredient[];
  constructorItems: {
    price: number;
    bun: TConstructorIngredient | null;
    ingredients: TConstructorIngredient[];
  };
}

const initialState: ConstructorSliceState = {
  isLoading: true,
  error: null,
  ingredients: [],
  buns: [],
  mains: [],
  sauces: [],
  constructorItems: {
    price: 0,
    bun: null,
    ingredients: []
  }
};

export const constructorSlice = createSlice({
  name: 'constructorSlice',
  initialState,
  reducers: {
    addIngredientToConstructorItems: (state, action) => {
      if (action.payload.type === 'bun') {
        const currentBunPrice = state.constructorItems.bun?.price || 0;

        state.constructorItems.price =
          state.constructorItems.price - currentBunPrice * 2;

        state.constructorItems.bun = action.payload;

        state.constructorItems.price =
          state.constructorItems.price + action.payload.price * 2;
      } else {
        state.constructorItems.ingredients.push({
          ...action.payload,
          id: nanoid()
        });
        state.constructorItems.price =
          state.constructorItems.price + action.payload.price;
      }
    },
    removeIngredientFromConstructorItems: (state, action) => {
      if (action.payload.type === 'bun') {
        const currentBunPrice = state.constructorItems.bun?.price || 0;

        state.constructorItems.bun = null;
        state.constructorItems.price =
          state.constructorItems.price - currentBunPrice * 2;
      } else {
        state.constructorItems.ingredients =
          state.constructorItems.ingredients.filter(
            (item) => item.id !== action.payload.id
          );

        state.constructorItems.price =
          state.constructorItems.price - action.payload.price;
      }
    },
    moveIngredientInConstructorItems: (
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) => {
      const { fromIndex, toIndex } = action.payload;
      const items = state.constructorItems.ingredients;

      if (
        fromIndex < 0 ||
        toIndex < 0 ||
        fromIndex >= items.length ||
        toIndex >= items.length ||
        fromIndex === toIndex
      ) {
        return;
      }

      const [movedItem] = items.splice(fromIndex, 1);
      items.splice(toIndex, 0, movedItem);
    },
    clearConstructorItems: (state) => {
      state.constructorItems = {
        price: 0,
        bun: null,
        ingredients: []
      };
    }
  },
  selectors: {
    getConstructorState: (state) => state,
    getIngredients: (state) => state.ingredients,
    getIngredientsStatus: (state) => state.isLoading,
    getConstructorItems: (state) => state.constructorItems,
    getIngredientById: (state, id: string) =>
      state.ingredients.find((item) => item._id === id)
  },
  extraReducers: (builder) => {
    builder
      .addCase(ingredientsInit.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.ingredients = [];
        state.buns = [];
        state.mains = [];
        state.sauces = [];
      })
      .addCase(ingredientsInit.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ingredients = action.payload;
        state.buns = state.ingredients.filter(
          (ingredient) => ingredient.type === 'bun'
        );
        state.mains = state.ingredients.filter(
          (ingredient) => ingredient.type === 'main'
        );
        state.sauces = state.ingredients.filter(
          (ingredient) => ingredient.type === 'sauce'
        );
      })
      .addCase(ingredientsInit.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.error = null;
        state.isLoading = false;
        state.constructorItems = {
          price: 0,
          bun: null,
          ingredients: []
        };
      })
      .addCase(logoutUser.rejected, (state) => {
        state.error = null;
        state.isLoading = false;
        state.constructorItems = {
          price: 0,
          bun: null,
          ingredients: []
        };
      })
      .addCase(forceLogout, (state) => {
        state.error = null;
        state.isLoading = false;
        state.constructorItems = {
          price: 0,
          bun: null,
          ingredients: []
        };
      });
  }
});

export const {
  addIngredientToConstructorItems,
  removeIngredientFromConstructorItems,
  moveIngredientInConstructorItems,
  clearConstructorItems
} = constructorSlice.actions;
export const {
  getConstructorState,
  getIngredients,
  getIngredientsStatus,
  getConstructorItems,
  getIngredientById
} = constructorSlice.selectors;
