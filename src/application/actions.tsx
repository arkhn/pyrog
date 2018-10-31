import config from './config';
import {
    action,
} from './types'

const serverUrl = config('app').serverURL

import {cw_patient_mapping} from './mockdata/mappings'

export function toggleDialogVisibility(): action{
    return {
        type: 'TOGGLE_DIALOG',
    }
}

export function changeCurrentDatabase(database: string): any {
    return (dispatch: any, getState: any) => {
        dispatch(updateStateCurrentDatabase(database))
        dispatch(fetchMapping())
    }
}

export function updateStateCurrentDatabase(database: string): action {
    return {
        type: 'UPDATE_STATE_CURRENT_DATABASE',
        value: database,
    }
}

export function changeCurrentFhirResource(resource: string): any {
    return (dispatch: any, getState: any) => {
        dispatch(updateStateCurrentFhirResource(resource))
        dispatch(fetchMapping())
    }
}

export function updateStateCurrentFhirResource(resource: string): action {
    return {
        type: 'UPDATE_STATE_CURRENT_FHIR_RESOURCE',
        value: resource,
    }
}

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
