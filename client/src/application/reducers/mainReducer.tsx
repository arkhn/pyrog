import { combineReducers } from "redux";

// Data fetching reducers
import sourceSchemas from "./sourceSchemas";
import recommendedColumns from "./recommendedColumns";
import selectedSourceReducer from "./selectedSource";
import toasterReducer from "./toaster";
import userReducer from "./user";

// View reducers
import mappingExplorer from "../containers/views/mappingExplorer/reducer";
import mimic from "../containers/views/mimic/reducer";

// Data reducer (also called canonical state)
const dataReducer = combineReducers({
  sourceSchemas,
  recommendedColumns
});

// View reducer
const viewReducer = combineReducers({
  mappingExplorer,
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
