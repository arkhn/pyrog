import config from './config';
import {
    action,
} from './types'

const serverUrl = config('app').serverURL

import {cw_patient_mapping} from './mockdata/mappings'
import {databaseNameList, fhirResourceNameList} from './mockdata/nameLists'
import {patientJson} from './mockdata/fhirJson'

export function toggleDialogVisibility(): action{
    return {
        type: 'TOGGLE_DIALOG',
    }
}

// Fetch databaseNameList and fhirResourceNameList

function simulateFetch(successCallback: any, delay: number) {
    return new Promise((sucessCallback: any) => setTimeout(sucessCallback, delay))
}

export function fetchInfoNameList(): any {
    return (dispatch: any, getState: any) => {
        dispatch(loadingNameLists())

        // TODO: add real data fetching
        Promise.all([
            simulateFetch(dispatch(fetchDatabaseNameListSuccess(databaseNameList)), 500),
            simulateFetch(dispatch(fetchFhirResourceNameListSuccess(fhirResourceNameList)), 500),
        ]).then((response: any) => {
            // TODO: handle errors
            dispatch(fetchInfoNameListSuccess())
        })
    }
}

export function loadingNameLists() {
    return {
        type: 'LOADING_NAME_LISTS',
    }
}

export const fetchInfoNameListSuccess = () : action => {
    return {
        type: 'FETCH_INFO_NAME_LIST_SUCCESS',
    }
}

export const fetchInfoNameListFailure= () : action => {
    return {
        type: 'FETCH_INFO_NAME_LIST_FAILURE',
    }
}

export function fetchDatabaseNameListSuccess(databaseNameList: string[]): action {
    return {
        type: 'FETCH_DATABASE_NAME_LIST_SUCCESS',
        value: databaseNameList,
    }
}

export function fetchDatabaseNameListFailure(error: any): action {
    return {
        type: 'FETCH_DATABASE_NAME_LIST_FAILURE',
        value: error,
    }
}

export function fetchFhirResourceNameListSuccess(fhirResourceNameList: string[]): action {
    return {
        type: 'FETCH_FHIR_RESOURCE_NAME_LIST_SUCCESS',
        value: fhirResourceNameList,
    }
}

export function fetchFhirResourceNameListFailure(error: any): action {
    return {
        type: 'FETCH_FHIR_RESOURCE_NAME_LIST_FAILURE',
        value: error,
    }
}

// currentDatabase changes

export function changeCurrentDatabase(database: string): any {
    return (dispatch: any, getState: any) => {
        dispatch(updateStateCurrentDatabase(database))
        dispatch(fetchMapping())
        // TODO: fetch database schema
    }
}

export function updateStateCurrentDatabase(database: string): action {
    return {
        type: 'UPDATE_STATE_CURRENT_DATABASE',
        value: database,
    }
}

// currentFhirResource changes

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

// Fetch fhirResourceJson

export function fetchFhirResourceJson(resource: string): any {
    return (dispatch: any, getState: any) => {
        const state = getState()
        if (state.currentDatabase && state.currentFhirResource) {
            // Either load and dispatch mock data
            // or implement true fetching code
            if (state.testState) {
                console.log('here')
                setTimeout(() => {
                    dispatch(fetchFhirResourceJsonSuccess(JSON.parse(patientJson)))
                }, 500)
            } else {
                // TODO: parse url correctly
                let url = state.distantServerUrl + state.currentDatabase + state.currentFhirResource

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

// Fetch mapping when currentDatabase and currentFhirResource
// are both set

export function fetchMapping(): any {
    return (dispatch: any, getState: any) => {
        const state = getState()
        if (state.currentDatabase && state.currentFhirResource) {
            dispatch(loadingMapping())

            // Either load and dispatch mock data
            // or implement true fetching code
            if (state.testState) {
                setTimeout(() => {
                    dispatch(fetchMappingSuccess(cw_patient_mapping))
                }, 500)
            } else {
                // TODO: parse url correctly
                let url = state.distantServerUrl + state.currentDatabase + state.currentFhirResource

                fetch(url)
                .then((response: any) => {
                    dispatch(fetchMappingSuccess(response.json()))
                }).catch( (err: any) => {
                    console.log(err)
                    dispatch(fetchMappingFailure(err))
                })
            }
        }
    }
}

export function loadingMapping(): action {
    return {
        type: 'LOADING_MAPPING',
    }
}

export function fetchMappingSuccess(mapping: any): action {
    return {
        type: 'FETCH_MAPPING_SUCCESS',
        value: mapping,
    }
}

export function fetchMappingFailure(error: any): action {
    return {
        type: 'FETCH_MAPPING_FAILURE',
        value: error,
    }
}

export function changeCurrentDBOwner(owner: string): action {
    return {
        type: 'CHANGE_CURRENT_DB_OWNER',
        value: owner,
    }
}

export function changeCurrentDBTable(table: string): action {
    return {
        type: 'CHANGE_CURRENT_DB_TABLE',
        value: table,
    }
}

export function changeCurrentDBPrimaryKey(pk: string): action {
    return {
        type: 'CHANGE_CURRENT_DB_PK',
        value: pk,
    }
}

export function changeCurrentTreeNode(originallySelected: boolean, nodePath: string[]): action {
    return {
        type: 'CHANGE_CURRENT_TREE_NODE',
        value: {
            originallySelected,
            nodePath,
        },
    }
}
