import * as redux from 'redux'

export interface fhirResource {
    loadedTime: number,
    content: string,
}

export interface appState {
    currentFhirResource: fhirResource,
    loading: number,
    dispatch?: redux.Dispatch<any>,
}

export interface action {
    type: string,
    promise?: (dispatch: any, getState: any) => any,
    value?: any,
}
