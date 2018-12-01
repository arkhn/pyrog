import * as redux from 'redux'

// REDUX
export interface ISimpleAction {
    type: string,
    payload?: any,
}

export type IThunkAction = (dispatch: redux.Dispatch<any>, getState: any) => void

export type IAction = ISimpleAction | IThunkAction

export interface IReduxStore {
    data: any,
    dispatch?: any,
    views: any,
}

// VIEWS

export interface IView {
    data: any,
    dispatch?: any,
}

// REACT

// TODO: Deprecate type
export interface IFhirResource {
    resourceType: string,
    owner: string,
    table: string,
    primaryKey: string,
    contentAsTree: any,
    inputColumnsDict?: any,
}

// TODO: Deprecate type
export interface IDatabase {
    name: string,
    schema: any,
}

export interface IDatabaseSchema {
    [owner: string]: {
        [table: string]: string[],
    }
}

export interface IDatabaseColumn {
    owner: string,
    table: string,
    column: string,
}

export interface IInputColumn extends IDatabaseColumn {
    join?: {
        sourceColumn: string,
        targetColumn: IDatabaseColumn,
    }
    script?: any,
}

export interface IFhirIntegrationSpec {
    inputColumns: IInputColumn[],
    mergingScript?: any,
    [Symbol.iterator]?: any,
}

export interface IMapping {
    primaryKeyColumn: IDatabaseColumn,
    fhirMapping: {
        [fhirAttribute: string]: IFhirIntegrationSpec,
    }
}
