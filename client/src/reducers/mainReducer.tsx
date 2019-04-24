import { combineReducers } from "redux";

// Data fetching reducers
import sourceSchemas from "./sourceSchemas";
import recommendedColumns from "./recommendedColumns";
import selectedSourceReducer from "./selectedSource";
import toasterReducer from "./toaster";
import userReducer from "./user";

// View reducers
import mapping from "../views/mapping/reducer";
import mimic from "../views/mimic/reducer";

// Data reducer (also called canonical state)
const dataReducer = combineReducers({
  sourceSchemas,
  recommendedColumns
});

// View reducer
const viewReducer = combineReducers({
  mapping,
  mimic
});

const mainReducer = combineReducers({
  data: dataReducer,
  selectedSource: selectedSourceReducer,
  toaster: toasterReducer,
  views: viewReducer,
  user: userReducer
});

export default mainReducer;
