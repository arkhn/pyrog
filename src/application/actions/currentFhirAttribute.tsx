import {IAction} from '../types'

export function changeCurrentFhirAttribute(originallySelected: boolean, nodePath: string[]): IAction {
    return {
        type: 'CHANGE_CURRENT_FHIR_ATTRIBUTE',
        payload: {
            originallySelected,
            nodePath,
        },
    }
}
