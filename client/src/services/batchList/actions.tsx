import { IAction, Batch } from 'types';

export const addBatch = (batch: Batch): IAction => {
  return {
    type: 'ADD_BATCH',
    payload: batch
  };
};

export const removeBatch = (batchId: string): IAction => {
  return {
    type: 'REMOVE_BATCH',
    payload: batchId
  };
};
