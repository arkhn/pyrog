import {action} from '../types'

export function changeCurrentFhirAttribute(originallySelected: boolean, nodePath: string[]): action {
    return {
        type: 'CHANGE_CURRENT_FHIR_ATTRIBUTE',
        value: {
            originallySelected,
            nodePath,
        },
    }
}
