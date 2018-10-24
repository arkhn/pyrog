import {
    action,
    IFhirResource,
} from './types'

import config from './config'
const serverUrl = config('app').serverURL

export function changeCurrentFhirResource(resource: IFhirResource): action {
    return {
        type: 'CHANGE_FHIR_RESOURCE',
        value: resource,
    }
}
