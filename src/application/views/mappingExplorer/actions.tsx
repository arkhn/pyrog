import {
    IAction,
} from '../../types'

export const updateDatabase = (database: string): IAction => {
    return {
        type: 'UPDATE_DATABASE',
        payload: database,
    }
}

export const updateFhirResource = (resource: string): IAction => {
    return {
        type: 'UPDATE_FHIR_RESOURCE',
        payload: resource,
    }
}

export const updateFhirAttribute = (attribute: string): IAction => {
    return {
        type: 'UPDATE_FHIR_ATTRIBUTE',
        payload: attribute,
    }
}
