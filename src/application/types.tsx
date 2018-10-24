import * as redux from 'redux'

export interface IFhirResource {
    name: string,
    content: any,
}

export interface appState {
    currentFhirResource: IFhirResource,
    loading: number,
    dispatch?: redux.Dispatch<any>,
}

export interface action {
    type: string,
    promise?: (dispatch: any, getState: any) => any,
    value?: any,
}
