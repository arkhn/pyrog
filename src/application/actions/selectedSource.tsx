import { IAction } from '../types'

import { fetchSourceSchema } from './sourceSchemas'

export const changeSelectedSource = (id: string, name: string): IAction => {
    return (dispatch: any, getState: any) => {
        dispatch(fetchSourceSchema(name, () => {
            return dispatch(updateSelectedSource(id, name))
        }))
    }
}

export const updateSelectedSource = (id: string, name: string): IAction => {
    return {
        type: 'UPDATE_SELECTED_SOURCE',
        payload: {
            id,
            name,
        },
    }
}

export const deselectSource = (): IAction => {
    return {
        type: 'DESELECTED_SOURCE',
    }
}
