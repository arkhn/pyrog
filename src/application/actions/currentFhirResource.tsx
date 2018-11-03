import {action} from '../types'
import {patientJson} from '../mockdata/fhirJson'
import {fetchMapping} from './mapping'

export function changeCurrentFhirResource(resource: string): any {
    return (dispatch: any, getState: any) => {
        dispatch(updateStateCurrentFhirResource(resource))
        dispatch(fetchFhirResourceJson(resource))
        dispatch(fetchMapping())
    }
}

export function updateStateCurrentFhirResource(resource: string): action {
    return {
        type: 'UPDATE_STATE_CURRENT_FHIR_RESOURCE',
        value: resource,
    }
}

export function fetchFhirResourceJson(resource: string): any {
    return (dispatch: any, getState: any) => {
        const state = getState()
        if (state.currentDatabase && state.currentFhirResource) {
            // Either load and dispatch mock data
            // or implement true fetching code
            if (state.appData.testState) {
                setTimeout(() => {
                    dispatch(fetchFhirResourceJsonSuccess(JSON.parse(patientJson)))
                }, 500)
            } else {
                // TODO: parse url correctly
                let url = state.distantServerUrl + state.currentDatabase.name + state.currentFhirResource.name

                fetch(url)
                .then((response: any) => {
                    dispatch(fetchFhirResourceJsonSuccess(response.json()))
                }).catch( (err: any) => {
                    console.log(err)
                    dispatch(fetchFhirResourceJsonFailure(err))
                })
            }
        }
    }
}

export function fetchFhirResourceJsonSuccess(json: any): action {
    return {
        type: 'FETCH_FHIR_RESOURCE_JSON_SUCCESS',
        value: json,
    }
}

export function fetchFhirResourceJsonFailure(error: any): action {
    return {
        type: 'FETCH_FHIR_RESOURCE_JSON_FAILURE',
        value: error,
    }
}
