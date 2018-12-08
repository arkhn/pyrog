import { IAction } from '../types'
import { INFO_URL } from '../app'

// The following actions query a rest api so as to fetch
// a string[] indicating fhir resources available on the server side.
export const loadingFhirResourceNames = () : IAction => {
    return {
        type: 'LOADING_FHIR_RESOURCE_NAMES',
    }
}

export const fetchFhirResourceNames = () : IAction => {
    return (dispatch: any, getState: any) => {
        dispatch(loadingFhirResourceNames())

        return fetch(`${INFO_URL}/fhir_resources`)
            .then((response: any) => {
                return response.json()
            }).then((response: any) => {
                dispatch(fetchFhirResourceNamesSuccess(response))
            }).catch((err: any) => {
                console.log(err)
                dispatch(fetchFhirResourceNamesFailure(err))
            })
    }
}

export const fetchFhirResourceNamesSuccess = (fhirResourceNameList: string[]): IAction => {
    return {
        type: 'FETCH_FHIR_RESOURCE_NAMES_SUCCESS',
        payload: fhirResourceNameList,
    }
}

export const fetchFhirResourceNamesFailure = (error: any): IAction => {
    return {
        type: 'FETCH_FHIR_RESOURCE_NAMES_FAILURE',
        payload: error,
    }
}

// The following actions fetch a json file from a distant server
// representing the fhir attributes of a given fhir resource.
export const loadingFhirResourceJson = () : IAction => {
    return {
        type: 'LOADING_FHIR_RESOURCE_JSON',
    }
}

export const fetchFhirResourceJson = (resourceName: string, callback: any) : IAction => {
    return (dispatch: any, getState: any) => {
        dispatch(loadingFhirResourceJson())

        return fetch(`${INFO_URL}/fhir_resource/${resourceName}`)
            .then((response: any) => {
                return response.json()
            }).then((response: any) => {
                dispatch(fetchFhirResourceJsonSuccess(resourceName, response))
                callback()
            }).catch((err: any) => {
                console.log(err)
                dispatch(fetchFhirResourceJsonFailure(err))
            })
    }
}

export const fetchFhirResourceJsonSuccess = (resourceName: string, json: any): IAction => {
    return {
        type: 'FETCH_FHIR_RESOURCE_JSON_SUCCESS',
        payload: {
            resourceName,
            json,
        },
    }
}

export const fetchFhirResourceJsonFailure = (error: any): IAction => {
    return {
        type: 'FETCH_FHIR_RESOURCE_JSON_FAILURE',
        payload: error,
    }
}
