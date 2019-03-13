import {
    ISelectedDatabase,
    ISimpleAction,
} from '../types'

const initialState: ISelectedDatabase = {
    id: null,
    name: null,
}

const selectedDatabaseReducer = (state = initialState, action: ISimpleAction): any => {
    switch (action.type) {
        case 'UPDATE_SELECTED_DATABASE':
            return {
                ...state,
                id: action.payload.id,
                name: action.payload.name,
            }

        default:
            return state
    }
}

export default selectedDatabaseReducer
