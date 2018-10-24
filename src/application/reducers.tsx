import {
    action,
    appState,
} from './types'

const initialAppState: appState = {
    currentFhirResource: null,
    loading: 0,
}

export function reducer(state = initialAppState, action: action): appState {
    switch (action.type) {
        case 'LOADING':
            return {
                ...state,
                loading: state.loading + 1,
            }

        case 'FETCH_FHIR_RESOURCE_SUCCESS':
            return {
                ...state,
                currentFhirResource: {
                    ...action.value.entry
                },
                loading: state.loading - 1,
            }

        case 'FETCH_FAILURE':
            return {
                ...state,
                loading: state.loading - 1,
            }

        default:
            return state
    }
}
