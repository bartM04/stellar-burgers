import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { TIngredient, TConstructorIngredient, TConstructorState } from '@utils-types';

const initialState: TConstructorState = {
  bun: null,
  ingredients: [],
};

export const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addBun: (state, action: PayloadAction<TIngredient>) => {
      state.bun = { ...action.payload, id: 'bun-' + Date.now() } as TConstructorIngredient;
    },
    addIngredient: (state, action: PayloadAction<TIngredient>) => {
      state.ingredients.push({ ...action.payload, id: Date.now().toString() } as TConstructorIngredient);
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter((item) => item.id !== action.payload);
    },
    moveIngredient: (state, action: PayloadAction<{ from: number; to: number }>) => {
      const { from, to } = action.payload;
      if (to < 0 || to >= state.ingredients.length) return;
      const [item] = state.ingredients.splice(from, 1);
      state.ingredients.splice(to, 0, item);
    },
    resetConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    },
  },
});

export const { addBun, addIngredient, removeIngredient, moveIngredient, resetConstructor } = constructorSlice.actions;

export default constructorSlice.reducer;