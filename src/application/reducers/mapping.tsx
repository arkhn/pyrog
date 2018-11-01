import {
    action,
    IReduxMapping
} from '../types'

const initialState: IReduxMapping = {
    loading: false,
    content: null,
}

export const mapping = (state = initialState, action: action): IReduxMapping => {
    switch (action.type) {
        case 'LOADING_MAPPING':
            return {
                ...state,
                loading: true,
            }

        case 'FETCH_MAPPING_SUCCESS':
            return {
                loading: false,
                content: action.value,
            }

        case 'FETCH_MAPPING_FAILURE':
            return {
                ...state,
                loading: false,
            }

        default:
            return state
    }
}
