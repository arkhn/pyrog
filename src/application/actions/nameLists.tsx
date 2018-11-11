import {action} from '../types'
import {
    fhirResourceNameList
} from '../mockdata/nameLists'

function simulateFetch(successCallback: any, delay: number) {
    return new Promise((sucessCallback: any) => setTimeout(sucessCallback, delay))
}

// Trigger fetching databaseNameList and fhirResourceNameList

export const fetchInfoNameList = (): any => {
    return (dispatch: any, getState: any) => {
        dispatch(loadingNameLists())

        Promise.all([
            dispatch(fetchDatabaseNames('https://api.live.arkhn.org/schemas')),
            simulateFetch(dispatch(fetchFhirResourceNameListSuccess(fhirResourceNameList)), 500),
        ]).then((response: any) => {
            // TODO: handle errors
            dispatch(fetchInfoNameListSuccess())
        })
    }
}

export const loadingNameLists = (): action => {
    return {
        type: 'LOADING_NAME_LISTS',
    }
}

export const fetchInfoNameListSuccess = (): action => {
    return {
        type: 'FETCH_INFO_NAME_LIST_SUCCESS',
    }
}

export const fetchInfoNameListFailure = (): action => {
    return {
        type: 'FETCH_INFO_NAME_LIST_FAILURE',
    }
}

// Fetch databaseNameList

export const fetchDatabaseNames = (url: string) : action => {
    return (dispatch: any, getState: any) => {
        return fetch(url)
            .then((response: any) => {
                return response.json()
            }).then((response: any) => {
                dispatch(fetchDatabaseNameListSuccess(response))
            }).catch((err: any) => {
                console.log(err)
                dispatch(fetchDatabaseNameListFailure(err))
            })
    }
}

export const fetchDatabaseNameListSuccess = (databaseNameList: string[]): action => {
    return {
        type: 'FETCH_DATABASE_NAME_LIST_SUCCESS',
        payload: databaseNameList,
    }
}

export const fetchDatabaseNameListFailure = (error: any): action => {
    return {
        type: 'FETCH_DATABASE_NAME_LIST_FAILURE',
        payload: error,
    }
}

// Fetch fhirResourceNameList

export const fetchFhirResourceNameListSuccess = (fhirResourceNameList: string[]): action => {
    return {
        type: 'FETCH_FHIR_RESOURCE_NAME_LIST_SUCCESS',
        payload: fhirResourceNameList,
    }
}

export const fetchFhirResourceNameListFailure = (error: any): action => {
    return {
        type: 'FETCH_FHIR_RESOURCE_NAME_LIST_FAILURE',
        payload: error,
    }
}
