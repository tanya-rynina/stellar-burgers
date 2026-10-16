import { combineReducers } from '@reduxjs/toolkit';

import constructorReducer from './constructorSlice';
import ingredientsReducer from './ingredientsSlice';
import userReducer from './userSlice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: constructorReducer,
  user: userReducer,
});
