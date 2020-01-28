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
        source: {
          id: action.payload.id,
          name: action.payload.name,
          schemaFileName: action.payload.schemaFileName,
          hasOwner: action.payload.hasOwner
        },
        resource: null,
        attribute: null
      };

    case 'UPDATE_FHIR_RESOURCE':
      return {
        ...state,
        resource: {
          id: action.payload.resourceId,
          label: action.payload.label,
          definition: {
            id: action.payload.definition.id,
            type: action.payload.definition.type
          }
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
