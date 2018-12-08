// Import custom types
import { ISimpleAction } from '../../types'
import { IMappingExplorerState } from './index'

const initialState: IMappingExplorerState = {
    selectedDatabase: null,
    selectedFhirResource: null,
    selectedFhirAttribute: [],
}

const reducer = (state = initialState, action: ISimpleAction): IMappingExplorerState => {
    switch (action.type) {
        case 'UPDATE_DATABASE':
            return {
                ...state,
                selectedDatabase: action.payload,
            }

        case 'UPDATE_FHIR_RESOURCE':
            return {
                ...state,
                selectedFhirResource: action.payload,
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
