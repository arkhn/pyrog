// Import custom types
import {
    IMappingExplorerState,
    ISimpleAction,
} from '../../types'

const initialState: IMappingExplorerState = {
    selectedDatabase: null,
    selectedFhirAttribute: null,
    selectedFhirResource: null,
}

const reducer = (state = initialState, action: ISimpleAction): IMappingExplorerState => {
    switch (action.type) {
        case 'UPDATE_DATABASE':
            return {
                ...state,
                selectedDatabase: action.payload,
            }

        default:
            return state
    }
}

export default reducer
