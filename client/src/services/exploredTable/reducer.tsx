import { ISimpleAction } from 'types';

const initialState = {
  resourceId: null,
  owner: null,
  table: null,
  fields: [],
  rows: [],
  loading: false,
  error: null
};

const exploredTable = (state = initialState, action: ISimpleAction) => {
  switch (action.type) {
    case 'EXPLORE_TABLE_LOADING': {
      return {
        ...action.payload,
        fields: [],
        rows: [],
        loading: true,
        error: null
      };
    }
    case 'EXPLORE_TABLE_SUCCESS': {
      return {
        ...action.payload,
        loading: false,
        error: null
      };
    }
    case 'EXPLORE_TABLE_FAILURE': {
      return {
        resourceId: null,
        owner: null,
        table: null,
        fields: [],
        rows: [],
        loading: false,
        error: action.payload
      };
    }
    default:
      return state;
  }
};

export default exploredTable;
