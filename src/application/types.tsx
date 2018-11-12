import * as redux from 'redux'

// Redux types
export interface simpleAction {
    type: string,
    payload?: any,
}

export type thunkAction = (dispatch: redux.Dispatch<any>, getState: any) => void

export type action = simpleAction | thunkAction

// React types

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

export interface reduxAppState {
    dispatch?: redux.Dispatch<any>,
    appData: IReduxAppData,
    nameLists: IReduxNameLists,
    currentDatabase: IReduxCurrentDatabase,
    currentFhirResource: IReduxCurrentFhirResource,
    currentFhirAttribute: string[],
    mapping: IReduxMapping,
}

export interface IReduxAppData {
    dialogIsOpen: boolean,
    distantServerUrl: string,
    testState: boolean,
}

export interface IReduxNameLists {
    loadingNameLists: boolean,
    databaseNames: {
        [database_name: string]: {
            name: string,
        }
    },
    fhirResources: {
        [resource_name: string]: any,
    },
    fhirDatatypes: {
        [datatype_name: string]: any,
    },
}

export interface IReduxCurrentDatabase {
    loadingSchema: boolean,
    name: string,
    schema: IDatabaseSchema,
}

export interface IReduxCurrentFhirResource {
    name: string,
    json: any,
    loadingResource: boolean,
}

export interface IReduxMapping {
    loading: boolean,
    content: IMapping,
}
