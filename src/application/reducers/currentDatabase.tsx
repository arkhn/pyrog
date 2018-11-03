import {
    action,
    IReduxCurrentDatabase
} from '../types'

import {
    cwDatabaseSchema
} from '../mockdata/databaseSchema'

const initialState: IReduxCurrentDatabase = {
    name: null,
    schema: cwDatabaseSchema,
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
