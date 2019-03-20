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

export const addResource = (): IAction => {
    return {
        type: 'ADD_RESOURCE',
    }
}

export const addProfile = (): IAction => {
    return {
        type: 'ADD_PROFILE',
    }
}

export const deleteProfile = (): IAction => {
    return {
        type: 'DELETE_PROFILE',
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
