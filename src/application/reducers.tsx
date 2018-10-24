import {
    action,
    appState,
} from './types'

import {FhirResources} from './mockData'

const initialAppState: appState = {
    currentFhirResource: FhirResources[1],
}

export function reducer(state = initialAppState, action: action): appState {
    switch (action.type) {
        case 'CHANGE_FHIR_RESOURCE':
            return {
                ...state,
                currentFhirResource: {
                    ...action.value
                }
            }

        default:
            return state
    }
}
