import {
    action,
    reduxAppState,
} from './types'

import {fhirResources, inputDatabases} from './mockdata/mockData'

const initialAppState: reduxAppState = {
    distantServerUrl: 'http://localhost:3000',
    testState: true,

    currentDatabase: null,
    currentFhirResource: null,
    currentFhirAttribute: [],

    databaseNameList: ['CW', 'DC', 'ORB'],
    fhirResourceNameList: ['Patient', 'Practioner', 'Medication'],
    databaseSchema: null,
    loadingMapping: false,
    mapping: null,
}

export function reducer(state = initialAppState, action: action): reduxAppState {
    switch (action.type) {
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
