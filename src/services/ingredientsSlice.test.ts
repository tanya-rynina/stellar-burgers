import reducer, { fetchIngredients } from './ingredientsSlice';

import type { TIngredientsState } from './ingredientsSlice';
import type { TIngredient } from '@utils-types';

describe('Тестирование редьюсера ingredientsSlice', () => {
  const initialState: TIngredientsState = {
    ingredients: [],
    isLoading: false,
    error: null,
  };

  const mockIngredients: TIngredient[] = [
    {
      _id: '1',
      name: 'Булка',
      type: 'bun',
      price: 100,
      image: 'image.png',
      image_large: 'image_large.png',
      image_mobile: 'image_mobile.png',
      calories: 100,
      carbohydrates: 10,
      fat: 10,
      proteins: 10,
    },
  ];

  it('должен вернуть начальное состояние при вызове с undefined и неизвестным экшеном', () => {
    expect(reducer(undefined, { type: 'UNKNOWN' })).toEqual(initialState);
  });

  it('должен обрабатывать fetchIngredients.pending', () => {
    const action = { type: fetchIngredients.pending.type };
    const newState = reducer(initialState, action);

    expect(newState.isLoading).toBe(true);
    expect(newState.error).toBeNull();
  });

  it('должен обрабатывать fetchIngredients.fulfilled', () => {
    const action = {
      type: fetchIngredients.fulfilled.type,
      payload: mockIngredients,
    };
    const newState = reducer(initialState, action);

    expect(newState.isLoading).toBe(false);
    expect(newState.ingredients).toEqual(mockIngredients);
  });

  it('должен обрабатывать fetchIngredients.rejected', () => {
    const action = {
      type: fetchIngredients.rejected.type,
      error: { message: 'Ошибка сети' },
    };
    const newState = reducer(initialState, action);

    expect(newState.isLoading).toBe(false);
    expect(newState.error).toBe('Ошибка сети');
  });
});
