import {
    action,
    IReduxCurrentDatabase
} from '../types'

const initialState: IReduxCurrentDatabase = {
    name: null,
    schema: null,
}

export const currentDatabase = (state = initialState, action: action): IReduxCurrentDatabase => {
    switch (action.type) {
        case 'UPDATE_STATE_CURRENT_DATABASE':
            return {
                ...state,
                name: action.value,
            }

        default:
            return state
    }
}
