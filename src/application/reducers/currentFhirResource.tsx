import {
    ISimpleAction,
    IReduxCurrentFhirResource
} from '../types'

const initialState: IReduxCurrentFhirResource = {
    name: null,
    json: null,
    loadingResource: false,
}

export const currentFhirResource = (state = initialState, action: ISimpleAction): IReduxCurrentFhirResource => {
    switch (action.type) {
        case 'LOADING_FHIR_RESOURCE':
            return {
                ...state,
                loadingResource: true,
            }

        case 'UPDATE_STATE_CURRENT_FHIR_RESOURCE':
            return {
                ...state,
                name: action.payload,
            }

        case 'FETCH_FHIR_RESOURCE_JSON_SUCCESS':
            return {
                ...state,
                json: action.payload,
                loadingResource: false,
            }

        case 'FETCH_FHIR_RESOURCE_JSON_FAILURE':
            return {
                ...state,
                loadingResource: false,
            }

        default:
            return state
    }
}
