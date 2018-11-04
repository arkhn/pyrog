import {
    action,
} from '../types'

const initialState: string[] = []

export const currentFhirAttribute = (state = initialState, action: action): string[] => {
    switch (action.type) {
        case 'CHANGE_CURRENT_FHIR_ATTRIBUTE':
            return !action.payload.originallySelected ? action.payload.nodePath : []

        default:
            return state
    }
}
