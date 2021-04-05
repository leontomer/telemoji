import { combineReducers } from "redux";
import authReducer from "./authReducer";
import errorsReducer from "./errorsReducer";
import addonReducer from "./addonReducer";
import modelReducer from './modelReducer';
import socketReducer from './socketReducer'

export default combineReducers({
  authReducer,
  errorsReducer,
  addonReducer,
  modelReducer,
  socketReducer
});
