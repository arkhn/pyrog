import { ISimpleAction } from 'types';

const initialState: any = {
  source: null,
  resource: null,
  attribute: null,
  selectedInputGroup: 0
};

const selectedNodeReducer = (
  state = initialState,
  action: ISimpleAction
): any => {
  switch (action.type) {
    case 'UPDATE_SOURCE':
      return {
        ...state,
        source: action.payload
      };

    case 'CHANGE_SOURCE':
      return {
        ...initialState,
        source: action.payload,
      };

    case 'UPDATE_RESOURCE':
      return {
        ...state,
        resource: action.payload.resource
      };

    case 'CHANGE_RESOURCE':
      return {
        ...state,
        resource: action.payload.resource,
        attribute: null,
        selectedInputGroup: 0
      };

    case 'UPDATE_ATTRIBUTE':
      return {
        ...state,
        attribute: action.payload.attribute
          ? {
              ...action.payload.attribute,
              path: action.payload.attribute.path
            }
          : null
      };

    case 'DESELECT_SOURCE':
      return {
        ...initialState
      };

    case 'DESELECT_RESOURCE':
      return {
        ...state,
        resource: null,
        attribute: null,
        selectedInputGroup: 0
      };

    case 'SELECT_INPUT_GROUP':
      return {
        ...state,
        selectedInputGroup: action.payload.selectedGroup
      };

    default:
      return state;
  }
};

export default selectedNodeReducer;
