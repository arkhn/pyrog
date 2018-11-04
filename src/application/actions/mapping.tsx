import {
    action,
    IReduxCurrentFhirResource,
} from '../types'

import {
    cw_patient_mapping,
} from '../mockdata/mappings'

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

export const clickRemoveJoin = (index: number) : any => {
    return (dispatch: any, getState: any) => {
        dispatch(deleteJoin(index, getState().currentFhirAttribute))
    }
}

export const deleteJoin = (index: number, currentFhirAttribute: IReduxCurrentFhirResource) : action => {
    return {
        type: 'DELETE_JOIN',
        value: {
            columnIndex: index,
            currentFhirAttribute: currentFhirAttribute,
        },
    }
}

export const clickAddJoin = (index: number) : any => {
    return (dispatch: any, getState: any) => {
        dispatch(addJoin(index, getState().currentFhirAttribute))
    }
}

export const addJoin = (index: number, currentFhirAttribute: IReduxCurrentFhirResource) : action => {
    return {
        type: 'ADD_JOIN',
        value: {
            columnIndex: index,
            currentFhirAttribute: currentFhirAttribute,
        },
    }
}

export const changeJoinSourceColumn = (index: number) : any => {
    return (item: any) : any => {
        return (dispatch: any, getState: any) => {
            dispatch(updateJoinSourceColumn(item, index, getState().currentFhirAttribute))
        }
    }
}

export const updateJoinSourceColumn = (item: any, index: number, currentFhirAttribute: IReduxCurrentFhirResource) : action => {
    return {
        type: 'UPDATE_JOIN_SOURCE_COLUMN',
        value: {
            item,
            columnIndex: index,
            currentFhirAttribute: currentFhirAttribute,
        },
    }
}

export const changeJoinTargetColumnOwner = (index: number) : any => {
    return (item: any) : any => {
        return (dispatch: any, getState: any) => {
            dispatch(updateJoinTargetColumnOwner(item, index, getState().currentFhirAttribute))
        }
    }
}

export const updateJoinTargetColumnOwner = (item: any, index: number, currentFhirAttribute: IReduxCurrentFhirResource) : action => {
    return {
        type: 'UPDATE_JOIN_TARGET_COLUMN_OWNER',
        value: {
            item,
            columnIndex: index,
            currentFhirAttribute: currentFhirAttribute,
        },
    }
}

export const changeJoinTargetColumnTable = (index: number) : any => {
    return (item: any) : any => {
        return (dispatch: any, getState: any) => {
            dispatch(updateJoinTargetColumnTable(item, index, getState().currentFhirAttribute))
        }
    }
}

export const updateJoinTargetColumnTable = (item: any, index: number, currentFhirAttribute: IReduxCurrentFhirResource) : action => {
    return {
        type: 'UPDATE_JOIN_TARGET_COLUMN_TABLE',
        value: {
            item,
            columnIndex: index,
            currentFhirAttribute: currentFhirAttribute,
        },
    }
}

export const changeJoinTargetColumnColumn = (index: number) : any => {
    return (item: any) : any => {
        return (dispatch: any, getState: any) => {
            dispatch(updateJoinTargetColumnColumn(item, index, getState().currentFhirAttribute))
        }
    }
}

export const updateJoinTargetColumnColumn = (item: any, index: number, currentFhirAttribute: IReduxCurrentFhirResource) : action => {
    return {
        type: 'UPDATE_JOIN_TARGET_COLUMN_COLUMN',
        value: {
            item,
            columnIndex: index,
            currentFhirAttribute: currentFhirAttribute,
        },
    }
}
