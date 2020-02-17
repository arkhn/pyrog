import { ISimpleAction } from 'types';

const initialState: any = {
  source: null,
  resource: null,
  attribute: null
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
        ...state,
        source: action.payload,
        resource: null,
        attribute: null
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
        attribute: null
      };

    case 'UPDATE_ATTRIBUTE':
      return {
        ...state,
        attribute: {
          ...action.payload.attribute,
          path: action.payload.attribute.serialize()
        }
      };

    case 'DESELECT_SOURCE':
      return {
        ...state,
        ...initialState
      };

    case 'DESELECT_RESOURCE':
      return {
        ...state,
        resource: null,
        attribute: null
      };

    default:
      return state;
  }
};

export default selectedNodeReducer;
