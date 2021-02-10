import { IReduxStore } from 'types';

const getExploredTable = (state: IReduxStore) => state.exploredTable;

export default getExploredTable;
