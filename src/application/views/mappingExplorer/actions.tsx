import {
    IAction,
} from '../../types'

export const updateDatabase = (database: string): IAction => {
    return {
        type: 'UPDATE_DATABASE',
        payload: database
    }
}
