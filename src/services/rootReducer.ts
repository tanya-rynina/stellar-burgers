import { combineReducers } from '@reduxjs/toolkit';

import constructorReducer from './constructorSlice';
import ingredientsReducer from './ingredientsSlice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: constructorReducer,
});
