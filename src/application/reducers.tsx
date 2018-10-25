import {
    action,
    appState,
} from './types'

import {fhirResources, inputDatabases} from './mockdata/mockData'

const initialAppState: appState = {
    currentFhirResource: fhirResources[0],
    currentInputDatabase: inputDatabases[0],
}

export function reducer(state = initialAppState, action: action): appState {
    switch (action.type) {
        case 'CHANGE_INPUT_DATABASE':
            return {
                ...state,
                currentInputDatabase: {
                    ...action.value
                }
            }

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
