import { combineReducers } from "redux";
import authReducer from "./authReducer";
import errorsReducer from "./errorsReducer";
import addonReducer from "./addonReducer";

export default combineReducers({
  authReducer,
  errorsReducer,
  addonReducer,
});
