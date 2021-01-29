import { IReduxStore } from 'types';

const getScriptList = (state: IReduxStore) => state.scriptList;

export default getScriptList;
