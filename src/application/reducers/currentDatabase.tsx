import {
    simpleAction,
    IReduxCurrentDatabase
} from '../types'

import {
    cwDatabaseSchema
} from '../mockdata/databaseSchema'

const initialState: IReduxCurrentDatabase = {
    name: null,
    schema: cwDatabaseSchema,
}

export const currentDatabase = (state = initialState, action: simpleAction): IReduxCurrentDatabase => {
    switch (action.type) {
        case 'UPDATE_STATE_CURRENT_DATABASE':
            return {
                ...state,
                name: action.payload,
            }

        case 'FETCH_DATABASE_SCHEMA_SUCCESS':
            return {
                ...state,
                schema: action.payload,
            }

        default:
            return state
    }
}
