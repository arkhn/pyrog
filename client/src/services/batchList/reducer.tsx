import { ISimpleAction, BatchList } from 'types';

const initialState: BatchList = {
  data: {},
  error: null
};

const batchList = (state = initialState, action: ISimpleAction): any => {
  switch (action.type) {
    case 'LIST_BATCH_SUCCESS': {
      return {
        data: { ...action.payload },
        error: null
      };
    }
    case 'LIST_BATCH_FAILED': {
      return {
        ...state,
        error: action.payload
      };
    }
    default:
      return state;
  }
};

export default batchList;
