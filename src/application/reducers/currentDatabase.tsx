import {
    ISimpleAction,
    IReduxCurrentDatabase
} from '../types'

import {
    cwDatabaseSchema
} from '../mockdata/databaseSchema'

const initialState: IReduxCurrentDatabase = {
    name: null,
    schema: cwDatabaseSchema,
    loadingSchema: false,
}

export const currentDatabase = (state = initialState, action: ISimpleAction): IReduxCurrentDatabase => {
    switch (action.type) {
        case 'LOADING_DATABASE_SCHEMA':
            return {
                ...state,
                loadingSchema: true,
            }

        case 'UPDATE_STATE_CURRENT_DATABASE':
            return {
                ...state,
                name: action.payload,
            }

        case 'FETCH_DATABASE_SCHEMA_SUCCESS':
            return {
                ...state,
                schema: action.payload,
                loadingSchema: false,
            }

        case 'FETCH_DATABASE_SCHEMA_FAILURE':
            return {
                ...state,
                loadingSchema: false,
            }

        default:
            return state
    }
}
