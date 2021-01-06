import { ISimpleAction, Batch } from 'types';

const initialState: Record<string, Batch> = {};

const batchList = (state = initialState, action: ISimpleAction): any => {
  switch (action.type) {
    case 'ADD_BATCH': {
      return {
        ...state,
        [action.payload.id]: action.payload
      };
    }
    case 'REMOVE_BATCH': {
      const ret = { ...state };
      delete ret[action.payload];
      return ret;
    }
    default:
      return state;
  }
};

export default batchList;
