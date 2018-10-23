import {
    action,
    fhirResource,
} from './types'

import config from './config'
const serverUrl = config('app').serverURL

export function fetchFhirResource(url: string): action {
    return {
        type: 'FETCH_FHIR_RESOURCE',
        promise: (dispatch, getState) => {
            dispatch(loading())

            fetch(serverUrl + url).then((res: any) => {
                return res.json()
            }).then( (json: any) => {
                dispatch(receivedFhirResourceSuccess(json))
            }).catch( (err: any) => {
                console.log(err)
                dispatch(fetchFailed(err))
            })
        }
    }
}

export function receivedFhirResourceSuccess(response: any): action {
    return {
        type: 'FETCH_FHIR_RESOURCE_SUCCESS',
        value: response,
    }
}

export function loading(): action {
    return {
        type: 'LOADING',
    }
}

export function fetchFailed(err: any): action {
    return {
        type: 'FETCH_FAILURE',
        value: err,
    }
}
