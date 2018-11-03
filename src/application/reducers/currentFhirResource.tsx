import {
    action,
    IReduxCurrentFhirResource
} from '../types'

const initialState: IReduxCurrentFhirResource = {
    name: null,
    json: null,
}

export const currentFhirResource = (state = initialState, action: action): IReduxCurrentFhirResource => {
    switch (action.type) {
        case 'UPDATE_STATE_CURRENT_FHIR_RESOURCE':
            return {
                ...state,
                name: action.value,
            }

        case 'FETCH_FHIR_RESOURCE_JSON_SUCCESS':
            return {
                ...state,
                json: action.value,
            }

        default:
            return state
    }
}
