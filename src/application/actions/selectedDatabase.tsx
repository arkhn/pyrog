import { IAction } from '../types'
import { INFO_URL } from '../app'

import { fetchDatabaseSchema } from './databaseSchemas'

export const changeSelectedDatabase = (id: string, name: string): IAction => {
    return (dispatch: any, getState: any) => {
        dispatch(fetchDatabaseSchema(name, () => {
            return dispatch(updateSelectedDatabase(id, name))
        }))
    }
}

export const updateSelectedDatabase = (id: string, name: string): IAction => {
    return {
        type: 'UPDATE_SELECTED_DATABASE',
        payload: {
            id,
            name,
        },
    }
}
