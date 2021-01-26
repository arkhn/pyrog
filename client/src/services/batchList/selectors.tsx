import { IReduxStore } from 'types';

const getBatchList = (state: IReduxStore) => state.batchList;

export default getBatchList;
