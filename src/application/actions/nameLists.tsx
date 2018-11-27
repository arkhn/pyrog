import {IAction} from '../types'

function simulateFetch(successCallback: any, delay: number) {
    return new Promise((sucessCallback: any) => setTimeout(sucessCallback, delay))
}

// Trigger fetching databaseNameList and fhirResourceNameList

export const fetchInfoNameList = (): any => {
    return (dispatch: any, getState: any) => {
        dispatch(loadingNameLists())

        Promise.all([
            dispatch(fetchDatabaseNames('https://api.live.arkhn.org/schemas')),
            dispatch(fetchFhirResources('https://api.live.arkhn.org/fhir_resources')),
            dispatch(fetchFhirDatatypes('https://api.live.arkhn.org/fhir_datatypes')),
        ]).then((response: any) => {
            // TODO: handle errors
            dispatch(fetchInfoNameListSuccess())
        })
    }
}

export const loadingNameLists = (): IAction => {
    return {
        type: 'LOADING_NAME_LISTS',
    }
}

export const fetchInfoNameListSuccess = (): IAction => {
    return {
        type: 'FETCH_INFO_NAME_LIST_SUCCESS',
    }
}

export const fetchInfoNameListFailure = (): IAction => {
    return {
        type: 'FETCH_INFO_NAME_LIST_FAILURE',
    }
}

// Fetch databaseNameList

export const fetchDatabaseNames = (url: string) : IAction => {
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

export const fetchDatabaseNameListSuccess = (databaseNameList: string[]): IAction => {
    return {
        type: 'FETCH_DATABASE_NAME_LIST_SUCCESS',
        payload: databaseNameList,
    }
}

export const fetchDatabaseNameListFailure = (error: any): IAction => {
    return {
        type: 'FETCH_DATABASE_NAME_LIST_FAILURE',
        payload: error,
    }
}

// Fetch fhirResourceNameList

export const fetchFhirResources = (url: string) : IAction => {
    return (dispatch: any, getState: any) => {
        return fetch(url)
            .then((response: any) => {
                return response.json()
            }).then((response: any) => {
                dispatch(fetchFhirResourcesSuccess(response))
            }).catch((err: any) => {
                console.log(err)
                dispatch(fetchFhirResourcesFailure(err))
            })
    }
}

export const fetchFhirResourcesSuccess = (fhirResourceNameList: string[]): IAction => {
    return {
        type: 'FETCH_FHIR_RESOURCES_SUCCESS',
        payload: fhirResourceNameList,
    }
}

export const fetchFhirResourcesFailure = (error: any): IAction => {
    return {
        type: 'FETCH_FHIR_RESOURCES_FAILURE',
        payload: error,
    }
}

// Fetch fhirDatatypeNameList

export const fetchFhirDatatypes = (url: string) : IAction => {
    return (dispatch: any, getState: any) => {
        return fetch(url)
            .then((response: any) => {
                return response.json()
            }).then((response: any) => {
                dispatch(fetchFhirDatatypesSuccess(response))
            }).catch((err: any) => {
                console.log(err)
                dispatch(fetchFhirDatatypesFailure(err))
            })
    }
}

export const fetchFhirDatatypesSuccess = (fhirDatatypes: any): IAction => {
    return {
        type: 'FETCH_FHIR_DATATYPES_SUCCESS',
        payload: fhirDatatypes,
    }
}

export const fetchFhirDatatypesFailure = (error: any): IAction => {
    return {
        type: 'FETCH_FHIR_DATATYPES_FAILURE',
        payload: error,
    }
}
