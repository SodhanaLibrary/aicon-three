import { combineReducers } from 'redux';
import appReducer from './appReducer';
import apiReducer from './apiReducer';
import animationReducer from './animationReducer';
import globalReducer from './globalReducer';
import searchReducer from './searchReducer';
 
export default combineReducers({
  app:appReducer,
  animation:animationReducer,
  api:apiReducer,
  global:globalReducer,
  search:searchReducer
});
