import {
    action,
    IFhirResource,
    IDatabase,
} from './types'

import config from './config'
const serverUrl = config('app').serverURL

export function changeCurrentInputDatabase(database: IDatabase): action {
    return {
        type: 'CHANGE_INPUT_DATABASE',
        value: database,
    }
}

export function changeCurrentFhirResource(resource: IFhirResource): action {
    return {
        type: 'CHANGE_FHIR_RESOURCE',
        value: resource,
    }
}
