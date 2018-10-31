import * as redux from 'redux'

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
    name: string,
    schema: {
        [owner: string]: {
            [table: string]: string[],
        }
    }
}

export interface IDatabaseColumn {
    owner: string,
    table: string,
    column: string,
}

export interface IInputColumn extends IDatabaseColumn {
    owner: string,
    table: string,
    column: string,
    join: {
        sourceColumn: IDatabaseColumn,
        targetColumn: IDatabaseColumn,
    }
    script: any,
}

export interface IMapping {
    pathToPrimaryKey: IDatabaseColumn,
    fhirMapping: {
        [fhirAttribute: string]: {
            inputColumns: IInputColumn[],
            mergingScript?: any,
        }
    }
}

export interface reduxAppState {
    dispatch?: redux.Dispatch<any>,

    // App information
    distantServerUrl: string,
    testState: boolean,

    // User-selected variables
    currentDatabase: string,
    currentFhirResource: string,
    currentFhirAttribute: string[],

    // To fetch from backend
    databaseNameList: string[],
    fhirResourceNameList: string[],
    databaseSchema: IDatabaseSchema,
    // This is what users acutally modify
    // and upload.
    loadingMapping: boolean,
    mapping: IMapping,
}

export interface action {
    type: string,
    value?: any,
}
