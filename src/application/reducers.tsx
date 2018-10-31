import { fhirResources, inputDatabases } from './mockdata/mockData';
import {
    action,
    appState,
} from './types'


const initialAppState: appState = {
    currentFhirResource: fhirResources[0],
    currentInputDatabase: inputDatabases[0],
    currentTreeNodePath: [],
    dialogIsOpen: false,
}

export function reducer(state = initialAppState, action: action): appState {
    switch (action.type) {
        case 'TOGGLE_DIALOG':
            return {
                ...state,
                dialogIsOpen: !state.dialogIsOpen,
            } 
        case 'CHANGE_INPUT_DATABASE':
            return {
                ...state,
                currentInputDatabase: {
                    ...action.value
                },
                currentFhirResource: fhirResources[0],
                currentTreeNodePath: [],
            }

        case 'CHANGE_FHIR_RESOURCE':
            return {
                ...state,
                currentFhirResource: {
                    ...action.value
                },
                currentTreeNodePath: [],
            }

        case 'CHANGE_CURRENT_DB_OWNER':
            return {
                ...state,
                currentFhirResource: {
                    ...state.currentFhirResource,
                    owner: action.value,
                    table: null,
                    primaryKey: null,
                }
            }

        case 'CHANGE_CURRENT_DB_TABLE':
            return {
                ...state,
                currentFhirResource: {
                    ...state.currentFhirResource,
                    table: action.value,
                    primaryKey: null,
                }
            }

        case 'CHANGE_CURRENT_DB_PK':
            return {
                ...state,
                currentFhirResource: {
                    ...state.currentFhirResource,
                    primaryKey: action.value,
                }
            }

        case 'CHANGE_CURRENT_TREE_NODE':
            return {
                ...state,
                currentTreeNodePath: !action.value.originallySelected ? action.value.nodePath : [],
            }

        default:
            return state
    }
}
