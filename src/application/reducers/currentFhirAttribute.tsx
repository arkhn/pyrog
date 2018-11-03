import {
    action,
} from '../types'

const initialState: string[] = []

export const currentFhirAttribute = (state = initialState, action: action): string[] => {
    switch (action.type) {
        case 'CHANGE_CURRENT_FHIR_ATTRIBUTE':
            return !action.value.originallySelected ? action.value.nodePath : []

        default:
            return state
    }
}
