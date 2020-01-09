import { ISimpleAction } from "../../types";

const initialState: any = {
  source: {
    id: null,
    name: null,
    schemaFileName: null,
    hasOwner: null
  },
  resource: {
    id: null,
    fhirType: null,
    label: null
  },
  attribute: {
    id: null,
    name: null
  }
};

const selectedNodeReducer = (
  state = initialState,
  action: ISimpleAction
): any => {
  switch (action.type) {
    case "UPDATE_NODE":
      return {
        ...state,
        source: {
          ...action.payload.source
        },
        resource: {
          ...action.payload.resource
        },
        attribute: {
          ...action.payload.attribute
        }
      };

    case "UPDATE_SELECTED_SOURCE":
      return {
        ...state,
        source: {
          id: action.payload.id,
          name: action.payload.name,
          schemaFileName: action.payload.schemaFileName,
          hasOwner: action.payload.hasOwner
        },
        resource: {
          id: null,
          fhirType: null,
          label: null
        },
        attribute: {
          id: null,
          name: null
        }
      };

    case "UPDATE_FHIR_RESOURCE":
      return {
        ...state,
        resource: {
          id: action.payload.resourceId,
          fhirType: action.payload.fhirType,
          label: action.payload.label
        },
        attribute: {
          id: null,
          name: null
        }
      };

    case "DESELECTED_FHIR_RESOURCE":
      return {
        ...state,
        resource: {
          id: null,
          fhirType: null,
          label: null
        },
        attribute: {
          id: null,
          name: null
        }
      };

    case "UPDATE_FHIR_ATTRIBUTE":
      return {
        ...state,
        attribute: {
          id: action.payload.attributeId,
          name: action.payload.attributeName
        }
      };

    case "DESELECTED_SOURCE":
      return {
        ...state,
        ...initialState
      };

    default:
      return state;
  }
};

export default selectedNodeReducer;
