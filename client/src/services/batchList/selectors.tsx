import { IReduxStore, Batch } from 'types';

const getBatchList = (state: IReduxStore): Record<string, Batch> =>
  state.batchList;

export default getBatchList;
