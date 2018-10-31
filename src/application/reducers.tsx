import {
    action,
    reduxAppState,
} from './types'

const initialAppState: reduxAppState = {
    distantServerUrl: 'http://localhost:3000',
    testState: true,

    currentDatabase: null,
    currentFhirResource: null,
    currentFhirAttribute: [],

    loadingNameLists: false,
    databaseNameList: [],
    fhirResourceNameList: [],
    databaseSchema: null,
    loadingMapping: false,
    mapping: null,
}

export function reducer(state = initialAppState, action: action): reduxAppState {
    switch (action.type) {
        case 'LOADING_NAME_LISTS':
            return {
                ...state,
                loadingNameLists: true,
            }

        case 'FETCH_INFO_NAME_LIST_SUCCESS':
            return {
                ...state,
                loadingNameLists: false,
            }

        case 'FETCH_DATABASE_NAME_LIST_SUCCESS':
            return {
                ...state,
                databaseNameList: action.value,
            }

        case 'FETCH_FHIR_RESOURCE_NAME_LIST_SUCCESS':
            return {
                ...state,
                fhirResourceNameList: action.value,
            }

        case 'UPDATE_STATE_CURRENT_DATABASE':
            return {
                ...state,
                currentDatabase: action.value,
            }

        case 'UPDATE_STATE_CURRENT_FHIR_RESOURCE':
            return {
                ...state,
                currentFhirResource: action.value,
            }

        case 'LOADING_MAPPING':
            return {
                ...state,
                loadingMapping: true,
            }

        case 'FETCH_MAPPING_SUCCESS':
            return {
                ...state,
                loadingMapping: false,
                mapping: action.value,
            }

        case 'FETCH_MAPPING_FAILURE':
            return {
                ...state,
                loadingMapping: false,
            }

        case 'CHANGE_PK_OWNER':
            return {
                ...state,
                mapping: {
                    ...state.mapping,
                    pathToPrimaryKey: {
                        owner: action.value,
                        table: null,
                        column: null,
                    }
                }
            }

        case 'CHANGE_PK_TABLE':
            return {
                ...state,
                mapping: {
                    ...state.mapping,
                    pathToPrimaryKey: {
                        ...state.mapping.pathToPrimaryKey,
                        table: action.value,
                        column: null,
                    }
                }
            }

        case 'CHANGE_PK_COLUMN':
            return {
                ...state,
                mapping: {
                    ...state.mapping,
                    pathToPrimaryKey: {
                        ...state.mapping.pathToPrimaryKey,
                        column: action.value,
                    }
                }
            }

        case 'CHANGE_CURRENT_FHIR_ATTRIBUTE':
            return {
                ...state,
                currentFhirAttribute: !action.value.originallySelected ? action.value.nodePath : [],
            }

        default:
            return state
    }
}
