import { combineReducers } from "redux";
import authReducer from "./authReducers";
import tokenReducer from "./tokenReducers";
import errorReducer from "./errorReducers";
export default combineReducers({
    auth: authReducer,
    token: tokenReducer,
    errors: errorReducer
});