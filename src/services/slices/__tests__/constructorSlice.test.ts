import reducer, {
  addBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  resetConstructor,
} from '../constructorSlice';
import type { TConstructorState, TConstructorIngredient } from '@utils-types';

jest.mock('@reduxjs/toolkit', () => {
  const originalModule = jest.requireActual('@reduxjs/toolkit');
  return {
    __esModule: true,
    ...originalModule,
    nanoid: () => 'test-id',
  };
});

describe('Тестирование редьюсера burgerConstructor', () => {
  const initialState: TConstructorState = {
    bun: null,
    ingredients: [],
  };

  const mockBun: TConstructorIngredient = {
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
    id: 'bun-test-id',
  };

  const mockIngredient: TConstructorIngredient = {
    _id: '6acd6b8163765e96530bd9f0',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    calories: 4242,
    carbohydrates: 242,
    price: 424,
    image: 'https://norma.ffapi.ru/images/meat-01.png',
    image_mobile: 'https://norma.ffapi.ru/images/meat-01-mobile.png',
    image_large: 'https://norma.ffapi.ru/images/meat-01-large.png',
    id: 'test-id',
  };

  it('должен вернуть начальное состояние', () => {
    expect(reducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('должен обработать addBun', () => {
    const action = addBun(mockBun);
    const state = reducer(initialState, action);

    expect(state.bun).toEqual(mockBun);
  });

  it('должен обработать addIngredient', () => {
    const action = addIngredient(mockIngredient);
    const state = reducer(initialState, action);

    expect(state.ingredients).toContainEqual(mockIngredient);
  });

  it('должен обработать removeIngredient', () => {
    const stateWithIngredient: TConstructorState = {
      bun: null,
      ingredients: [mockIngredient],
    };
    const action = removeIngredient(mockIngredient.id);
    const state = reducer(stateWithIngredient, action);

    expect(state.ingredients).not.toContainEqual(mockIngredient);
    expect(state.ingredients.length).toBe(0);
  });

  it('должен обработать moveIngredient', () => {
    const secondIngredient: TConstructorIngredient = {
      ...mockIngredient,
      id: 'test-id-2',
    };
    const stateWithIngredients: TConstructorState = {
      bun: null,
      ingredients: [mockIngredient, secondIngredient],
    };
    const action = moveIngredient({ from: 0, to: 1 });
    const state = reducer(stateWithIngredients, action);

    expect(state.ingredients[0]).toEqual(secondIngredient);
    expect(state.ingredients[1]).toEqual(mockIngredient);
  });

  it('должен обработать resetConstructor', () => {
    const stateWithItems: TConstructorState = {
      bun: mockBun,
      ingredients: [mockIngredient],
    };
    const action = resetConstructor();
    const state = reducer(stateWithItems, action);

    expect(state).toEqual(initialState);
  });

  it('должен обработать createOrder.fulfilled', () => {
    const stateWithItems: TConstructorState = {
      bun: mockBun,
      ingredients: [mockIngredient],
    };
    const action = { type: 'order/createOrder/fulfilled' };
    const state = reducer(stateWithItems, action);

    expect(state).toEqual(initialState);
  });

  it('должен вернуть текущее состояние при неизвестном экшене', () => {
    const unknownAction = { type: 'UNKNOWN_ACTION' };
    const state = reducer(initialState, unknownAction);

    expect(state).toEqual(initialState);
  });
});