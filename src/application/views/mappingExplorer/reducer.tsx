// Import custom types
import { ISimpleAction } from '../../types'
import { IMappingExplorerState } from './index'

const initialState: IMappingExplorerState = {
    selectedDatabase: null,
    selectedFhirResource: {
        name: null,
        id: null,
    },
    selectedFhirAttribute: [],
}

const reducer = (state = initialState, action: ISimpleAction): IMappingExplorerState => {
    switch (action.type) {
        case 'UPDATE_DATABASE':
            return {
                ...state,
                selectedDatabase: action.payload,
                selectedFhirAttribute: [],
            }

        case 'UPDATE_FHIR_RESOURCE':
            return {
                ...state,
                selectedFhirResource: {
                    name: action.payload.resourceName,
                    id: action.payload.resourceId,
                },
                selectedFhirAttribute: [],
            }

        case 'UPDATE_FHIR_ATTRIBUTE':
            return {
                ...state,
                selectedFhirAttribute: action.payload,
            }

        default:
            return state
    }
}

export default reducer
