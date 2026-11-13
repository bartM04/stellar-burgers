import reducer, { fetchIngredients } from '../ingredientsSlice';
import type { TIngredientsState } from '../ingredientsSlice'

describe('Тестирование редьюсера ingredients', () => {
  const initialState: TIngredientsState = {
    ingredients: [],
    isLoading: false,
    error: null,
  };

  const mockIngredients = [
    {
      _id: '6acd6b8163765e371c0bd9eb',
      name: 'Краторная булка N-200i',
      type: 'bun',
      proteins: 80,
      fat: 24,
      calories: 420,
      carbohydrates: 53,
      price: 1255,
      image: 'https://norma.ffapi.ru/images/bun-02.png',
      image_mobile: 'https://norma.ffapi.ru/images/bun-02-mobile.png',
      image_large: 'https://norma.ffapi.ru/images/bun-02-large.png',
    },
  ];

  it('должен вернуть начальное состояние', () => {
    expect(reducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('должен обработать fetchIngredients.pending', () => {
    const action = { type: fetchIngredients.pending.type };
    const state = reducer(initialState, action);

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('должен обработать fetchIngredients.fulfilled', () => {
    const action = {
      type: fetchIngredients.fulfilled.type,
      payload: mockIngredients,
    };
    const state = reducer(initialState, action);

    expect(state.isLoading).toBe(false);
    expect(state.ingredients).toEqual(mockIngredients);
  });

  it('должен обработать fetchIngredients.rejected', () => {
    const action = {
      type: fetchIngredients.rejected.type,
      error: { message: 'Ошибка загрузки' },
    };
    const state = reducer(initialState, action);

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка загрузки');
  });

  it('должен вернуть текущее состояние при неизвестном экшене', () => {
    const unknownAction = { type: 'UNKNOWN_ACTION' };
    const state = reducer(initialState, unknownAction);

    expect(state).toEqual(initialState);
  });
});