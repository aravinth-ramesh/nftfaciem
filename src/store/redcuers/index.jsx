import { combineReducers } from "redux";
import PageReducer from "./PageReducer";

export default combineReducers({
  page: PageReducer,
});
