import { ISourceSchemas, ISimpleAction } from "../../../types";

const initialState: ISourceSchemas = {
  loadingSourceSchema: false,
  schemaBySourceName: {}
};

const sourceSchemas = (state = initialState, action: ISimpleAction): any => {
  switch (action.type) {
    // Cases handling fhir resource json fetching
    case "LOADING_SOURCE_SCHEMA":
      return {
        ...state,
        loadingSourceSchema: true
      };

    case "FETCH_SOURCE_SCHEMA_SUCCESS":
      return {
        ...state,
        schemaBySourceName: {
          ...state.schemaBySourceName,
          [action.payload.sourceName]: {
            ...action.payload.schema
          }
        },
        loadingSourceSchema: false
      };

    case "FETCH_SOURCE_SCHEMA_FAILURE":
      return {
        ...state,
        loadingSourceSchema: false
      };

    default:
      return state;
  }
};

export default sourceSchemas;
