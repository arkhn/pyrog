import { ISourceSchemas, ISimpleAction } from '../../../types';

const initialState: ISourceSchemas = {
  loadingSourceSchema: false,
  schemaByFileName: {}
};

const sourceSchemas = (state = initialState, action: ISimpleAction): any => {
  switch (action.type) {
    // Cases handling fhir resource json fetching
    case 'LOADING_SOURCE_SCHEMA':
      return {
        ...state,
        loadingSourceSchema: true
      };

    case 'FETCH_SOURCE_SCHEMA_SUCCESS':
      return {
        ...state,
        schemaByFileName: {
          ...state.schemaByFileName,
          [action.payload.fileName]: {
            ...action.payload.schema
          }
        },
        loadingSourceSchema: false
      };

    case 'FETCH_SOURCE_SCHEMA_FAILURE':
      return {
        ...state,
        loadingSourceSchema: false
      };

    default:
      return state;
  }
};

export default sourceSchemas;
