// Import custom types
import { ISimpleAction } from '../../types'
import { IMappingExplorerState } from './index'

const initialState: IMappingExplorerState = {
    selectedDatabase: {
        id: null,
        name: null,
    },
    selectedFhirResource: {
        id: null,
        name: null,
    },
    selectedFhirAttribute: {
        id: null,
        name: null,
    },
}

const reducer = (state = initialState, action: ISimpleAction): IMappingExplorerState => {
    switch (action.type) {
        case 'UPDATE_DATABASE':
            return {
                ...state,
                selectedDatabase: {
                    id: action.payload.databaseId,
                    name: action.payload.databaseName,
                },
                selectedFhirResource: {
                    id: null,
                    name: null,
                },
                selectedFhirAttribute: {
                    id: null,
                    name: null,
                }
            }

        case 'UPDATE_FHIR_RESOURCE':
            return {
                ...state,
                selectedFhirResource: {
                    id: action.payload.resourceId,
                    name: action.payload.resourceName,
                },
                selectedFhirAttribute: {
                    id: null,
                    name: null,
                }
            }

        case 'UPDATE_FHIR_ATTRIBUTE':
            return {
                ...state,
                selectedFhirAttribute: {
                    id: action.payload.attributeId,
                    name: action.payload.attributeName,
                }
            }

        default:
            return state
    }
}

export default reducer
