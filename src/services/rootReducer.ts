import { combineReducers } from '@reduxjs/toolkit';

import constructorReducer from './constructorSlice';
import feedReducer from './feedSlice';
import ingredientsReducer from './ingredientsSlice';
import orderReducer from './orderSlice';
import profileOrdersReducer from './profileOrdersSlice';
import userReducer from './userSlice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: constructorReducer,
  user: userReducer,
  order: orderReducer,
  feed: feedReducer,
  profileOrders: profileOrdersReducer,
});
