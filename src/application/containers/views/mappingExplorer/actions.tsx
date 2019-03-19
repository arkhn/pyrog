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

export const updateAddResource = (resource: any): IAction => {
    return {
        type: 'UPDATE_ADD_RESOURCE',
        payload: {
            ...resource,
        }
    }
}

export const rebootAddResource = (): IAction => {
    return {
        type: 'REBOOT_ADD_RESOURCE',
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
