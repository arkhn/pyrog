import {
    simpleAction,
} from '../types'

const initialState: string[] = []

export const currentFhirAttribute = (state = initialState, action: simpleAction): string[] => {
    switch (action.type) {
        case 'CHANGE_CURRENT_FHIR_ATTRIBUTE':
            return !action.payload.originallySelected ? action.payload.nodePath : []

        default:
            return state
    }
}
