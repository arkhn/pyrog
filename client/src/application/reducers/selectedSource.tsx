import {
    ISelectedSource,
    ISimpleAction,
} from '../types'

const initialState: ISelectedSource = {
    id: null,
    name: null,
}

const selectedSourceReducer = (state = initialState, action: ISimpleAction): any => {
    switch (action.type) {
        case 'UPDATE_SELECTED_SOURCE':
            return {
                ...state,
                id: action.payload.id,
                name: action.payload.name,
            }

        case 'DESELECTED_SOURCE':
            return {
                ...state,
                ...initialState,
            }

        default:
            return state
    }
}

export default selectedSourceReducer
