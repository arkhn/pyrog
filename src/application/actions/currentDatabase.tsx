import {action} from '../types'
import {fetchMapping} from './mapping'

export function changeCurrentDatabase(database: string): any {
    return (dispatch: any, getState: any) => {
        dispatch(updateStateCurrentDatabase(database))
        dispatch(fetchMapping())
        // TODO: fetch database schema
    }
}

export function updateStateCurrentDatabase(database: string): action {
    return {
        type: 'UPDATE_STATE_CURRENT_DATABASE',
        payload: database,
    }
}
