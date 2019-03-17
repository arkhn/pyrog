import {
    IAction,
} from '../../../types'

// STATE UPDATES
export const updateFhirResource = (resourceId: string, resourceName: string): IAction => {
    return {
        type: 'UPDATE_FHIR_RESOURCE',
        payload: {
            resourceName,
            resourceId,
        }
    }
}

export const updateFhirAttribute = (attributeId: string, attributeName: string): IAction => {
    return {
        type: 'UPDATE_FHIR_ATTRIBUTE',
        payload: {
            attributeId,
            attributeName,
        }
    }
}
