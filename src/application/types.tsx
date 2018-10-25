import * as redux from 'redux'


export interface IDatabase {
    name: string,
    schema: {
        [owner: string]: {
            [table: string]: {
                [column: string]: any
            }
        }
    }
}

export interface IFhirResource {
    resourceType: string,
    owner: string,
    table: string,
    primaryKey: string,
    content: any,
}

export interface appState {
    currentInputDatabase :IDatabase,
    currentFhirResource: IFhirResource,
    dispatch?: redux.Dispatch<any>,
}

export interface action {
    type: string,
    promise?: (dispatch: any, getState: any) => any,
    value?: any,
}
