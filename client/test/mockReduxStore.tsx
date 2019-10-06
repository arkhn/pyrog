import { combineReducers, createStore, applyMiddleware } from "redux";
import { createLogger } from "redux-logger";

// Middlewares
const middlewares = [
  function thunkMiddleware({ dispatch, getState }: any) {
    return function(next: any) {
      return function(action: any) {
        return typeof action === "function"
          ? action(dispatch, getState)
          : next(action);
      };
    };
  }
];
if (process.env.NODE_ENV === "development") {
  // Log redux dispatch only in development
  middlewares.push(createLogger({}));
}

// Reducers

// Data fetching reducers
import sourceSchemas from "src/services/selectedNode/sourceSchemas/reducer";
import recommendedColumns from "src/services/recommendedColumns/reducer";
import selectedNodeReducer from "src/services/selectedNode/reducer";
import toasterReducer from "src/services/toaster/reducer";
import userReducer from "src/services/user/reducer";

// View reducers
import mimic from "src/views/mimic/reducer";

// Data reducer (also called canonical state)
const dataReducer = combineReducers({
  sourceSchemas,
  recommendedColumns
});

// View reducer
const viewReducer = combineReducers({
  mimic
});

const mainReducer = combineReducers({
  data: dataReducer,
  selectedNode: selectedNodeReducer,
  toaster: toasterReducer,
  views: viewReducer,
  user: userReducer
});

// Store
const finalCreateStore = applyMiddleware(...middlewares)(createStore);
const store = finalCreateStore(mainReducer);

export default store;
