import { ISimpleAction, Batch, BatchResponse } from 'types';

const initialState: BatchResponse = {
  data: {},
  error: null
};

const batchList = (state = initialState, action: ISimpleAction): any => {
  switch (action.type) {
    case 'LIST_BATCH_SUCCESS': {
      return {
        data: action.payload.reduce(
          (acc: Record<string, Batch>, batch: Batch) => ({
            ...acc,
            [batch.id]: { ...batch }
          }),
          {}
        ),
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
