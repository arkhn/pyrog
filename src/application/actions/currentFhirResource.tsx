import {action} from '../types'
import {patientJson} from '../mockdata/fhirJson'
import {fetchMapping} from './mapping'

export const changeCurrentFhirResource = (resource: string): any => {
    return (dispatch: any, getState: any) => {
        dispatch(loadingFhirResource())

        Promise.all([
            dispatch(fetchFhirResourceJson('https://api.live.arkhn.org', resource)),
        ])
        .then(() => {
            dispatch(updateStateCurrentFhirResource(resource))
            dispatch(fetchMapping())
        })
    }
}

export const updateStateCurrentFhirResource = (resource: string): action => {
    return {
        type: 'UPDATE_STATE_CURRENT_FHIR_RESOURCE',
        payload: resource,
    }
}

export const loadingFhirResource = () : action => {
    return {
        type: 'LOADING_FHIR_RESOURCE',
    }
}

export const fetchFhirResourceJson = (url: string, resourceName: string) : action => {
    return (dispatch: any, getState: any) => {
        return fetch(`${url}/fhir_resource/${resourceName}`)
            .then((response: any) => {
                return response.json()
            }).then((response: any) => {
                dispatch(fetchFhirResourceJsonSuccess(response))
            }).catch((err: any) => {
                console.log(err)
                dispatch(fetchFhirResourceJsonFailure(err))
            })
    }
}

export const fetchFhirResourceJsonSuccess = (json: any): action => {
    return {
        type: 'FETCH_FHIR_RESOURCE_JSON_SUCCESS',
        payload: json,
    }
}

export const fetchFhirResourceJsonFailure = (error: any): action => {
    return {
        type: 'FETCH_FHIR_RESOURCE_JSON_FAILURE',
        payload: error,
    }
}
