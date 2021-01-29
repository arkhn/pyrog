import { ISimpleAction, ScriptsResponse } from 'types';

const initialState: ScriptsResponse = {
  data: [],
  error: null
};

const batchList = (state = initialState, action: ISimpleAction): any => {
  switch (action.type) {
    case 'LIST_SCRIPTS_SUCCESS': {
      return {
        data: action.payload,
        error: null
      };
    }
    case 'LIST_SCRIPTS_FAILED': {
      return {
        data: [],
        error: action.payload
      };
    }
    default:
      return state;
  }
};

export default batchList;
