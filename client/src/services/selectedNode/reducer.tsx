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
    case 'UPDATE_SELECTED_SOURCE':
      return {
        ...state,
        source: action.payload,
        resource: null,
        attribute: null
      };

    case 'UPDATE_FHIR_RESOURCE':
      return {
        ...state,
        resource: {
          ...action.payload.resource
        },
        attribute: null
      };

    case 'DESELECTED_FHIR_RESOURCE':
      return {
        ...state,
        resource: null,
        attribute: null
      };

    case 'UPDATE_FHIR_ATTRIBUTE':
      return {
        ...state,
        attribute: {
          path: action.payload.attributePath
        }
      };

    case 'DESELECTED_SOURCE':
      return {
        ...state,
        ...initialState
      };

    default:
      return state;
  }
};

export default selectedNodeReducer;
