import {action} from '../types'
import {cw_patient_mapping} from '../mockdata/mappings'

export const fetchMapping = (): any => {
    return (dispatch: any, getState: any) => {
        const state = getState()
        if (state.currentDatabase && state.currentFhirResource) {
            dispatch(loadingMapping())

            // Either load and dispatch mock data
            // or implement true fetching code
            if (state.appData.testState) {
                setTimeout(() => {
                    dispatch(fetchMappingSuccess(cw_patient_mapping))
                }, 500)
            } else {
                // TODO: parse url correctly
                let url = state.distantServerUrl + state.currentDatabase.name + state.currentFhirResource.name

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

export const loadingMapping = (): action => {
    return {
        type: 'LOADING_MAPPING',
    }
}

export const fetchMappingSuccess = (mapping: any): action => {
    return {
        type: 'FETCH_MAPPING_SUCCESS',
        value: mapping,
    }
}

export const fetchMappingFailure = (error: any): action => {
    return {
        type: 'FETCH_MAPPING_FAILURE',
        value: error,
    }
}

export const clickAddInputColumn = (column: any): any => {
    return (dispatch: any, getState: any) => {
        dispatch(addInputColumn(column, getState().currentFhirAttribute))
    }
}

export const addInputColumn = (column: any, currentFhirAttribute: any): action => {
    return {
        type: 'ADD_INPUT_COLUMN',
        value: {
            currentFhirAttribute,
            column,
        },
    }
}

export const clickRemoveInputColumn = (columnIndex: number): any => {
    return (dispatch: any, getState: any) => {
        dispatch(removeInputColumn(columnIndex, getState().currentFhirAttribute))
    }
}

export const removeInputColumn = (columnIndex: number, currentFhirAttribute: any): action => {
    return {
        type: 'REMOVE_INPUT_COLUMN',
        value: {
            currentFhirAttribute,
            columnIndex,
        },
    }
}

export const updatePKOwner = (owner: string): action => {
    return {
        type: 'UPDATE_PK_OWNER',
        value: owner,
    }
}

export const updatePKTable = (table: string): action => {
    return {
        type: 'UPDATE_PK_TABLE',
        value: table,
    }
}

export const updatePKColumn = (column: string): action => {
    return {
        type: 'UPDATE_PK_COLUMN',
        value: column,
    }
}
