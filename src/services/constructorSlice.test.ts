import reducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
} from './constructorSlice';

import type { TConstructorState, TIngredient } from '@utils-types';

describe('Тестирование редьюсера constructorSlice', () => {
  const initialState: TConstructorState = {
    bun: null,
    ingredients: [],
  };

  const mockBun: TIngredient = {
    _id: 'bun1',
    name: 'Тестовая Булка',
    type: 'bun',
    price: 100,
    image: 'image.png',
    image_large: 'image_large.png',
    image_mobile: 'image_mobile.png',
    calories: 100,
    carbohydrates: 10,
    fat: 10,
    proteins: 10,
  };

  const mockMain: TIngredient = {
    _id: 'main1',
    name: 'Тестовая Начинка',
    type: 'main',
    price: 200,
    image: 'image.png',
    image_large: 'image_large.png',
    image_mobile: 'image_mobile.png',
    calories: 200,
    carbohydrates: 20,
    fat: 20,
    proteins: 20,
  };

  const mockSauce: TIngredient = {
    _id: 'sauce1',
    name: 'Тестовый Соус',
    type: 'sauce',
    price: 50,
    image: 'image.png',
    image_large: 'image_large.png',
    image_mobile: 'image_mobile.png',
    calories: 50,
    carbohydrates: 5,
    fat: 5,
    proteins: 5,
  };

  it('должен вернуть начальное состояние при вызове с undefined и неизвестным экшеном', () => {
    expect(reducer(undefined, { type: 'UNKNOWN' })).toEqual(initialState);
  });

  it('должен добавлять булку (addIngredient)', () => {
    const action = addIngredient(mockBun);
    const newState = reducer(initialState, action);

    expect(newState.bun).toBeDefined();
    if (newState.bun) {
      const { id, ...rest } = newState.bun;
      expect(typeof id).toBe('string');
      expect(rest).toEqual(mockBun);
    }
    expect(newState.ingredients).toEqual([]);
  });

  it('должен заменять старую булку на новую (addIngredient)', () => {
    const stateWithBun = reducer(initialState, addIngredient(mockBun));
    const newBun = { ...mockBun, name: 'Другая Булка', price: 150 };

    const newState = reducer(stateWithBun, addIngredient(newBun));

    expect(newState.bun).toBeDefined();
    if (newState.bun) {
      const { id, ...rest } = newState.bun;
      expect(typeof id).toBe('string');
      expect(rest).toEqual(newBun);
    }
  });

  it('должен добавлять начинку и соусы в массив (addIngredient)', () => {
    const actionMain = addIngredient(mockMain);
    const actionSauce = addIngredient(mockSauce);

    const stateWithMain = reducer(initialState, actionMain);
    const newState = reducer(stateWithMain, actionSauce);

    expect(newState.ingredients).toHaveLength(2);

    const { id: idMain, ...restMain } = newState.ingredients[0];
    expect(typeof idMain).toBe('string');
    expect(restMain).toEqual(mockMain);

    const { id: idSauce, ...restSauce } = newState.ingredients[1];
    expect(typeof idSauce).toBe('string');
    expect(restSauce).toEqual(mockSauce);
  });

  it('должен удалять ингредиент по id (removeIngredient)', () => {
    const stateWithMain = reducer(initialState, addIngredient(mockMain));
    const idToRemove = stateWithMain.ingredients[0].id;

    const action = removeIngredient(idToRemove);
    const newState = reducer(stateWithMain, action);

    expect(newState.ingredients).toEqual([]);
  });

  it('должен менять ингредиенты местами (moveIngredient)', () => {
    const stateWithMain = reducer(initialState, addIngredient(mockMain));
    const stateWithBoth = reducer(stateWithMain, addIngredient(mockSauce));

    const action = moveIngredient({ fromIndex: 0, toIndex: 1 });
    const newState = reducer(stateWithBoth, action);

    expect(newState.ingredients[0].name).toBe(mockSauce.name);
    expect(newState.ingredients[1].name).toBe(mockMain.name);
  });

  it('не должен менять состояние, если индексы выходят за границы (moveIngredient)', () => {
    const stateWithMain = reducer(initialState, addIngredient(mockMain));

    const action = moveIngredient({ fromIndex: 0, toIndex: 5 });
    const newState = reducer(stateWithMain, action);

    expect(newState).toEqual(stateWithMain);
  });

  it('должен очищать конструктор (clearConstructor)', () => {
    const stateWithBun = reducer(initialState, addIngredient(mockBun));
    const stateWithAll = reducer(stateWithBun, addIngredient(mockMain));

    const action = clearConstructor();
    const newState = reducer(stateWithAll, action);

    expect(newState).toEqual(initialState);
  });
});
