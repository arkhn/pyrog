import * as redux from 'redux';

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
    join?: {
        sourceColumn: string,
        targetColumn: IDatabaseColumn,
    }
    script?: any,
}

export interface IFhirIntegrationSpec {
    inputColumns: IInputColumn[],
    mergingScript?: any,
}

export interface IMapping {
    pathToPrimaryKey: IDatabaseColumn,
    fhirMapping: {
        [fhirAttribute: string]: IFhirIntegrationSpec,
    }
}

export interface reduxAppState {
    dispatch?: redux.Dispatch<any>,
    dialogIsOpen: boolean;

    // App information
    distantServerUrl: string,
    testState: boolean,

    // User-selected variables
    currentDatabase: string,
    currentFhirResource: string,
    currentFhirAttribute: string[],

    // To fetch from backend
    loadingNameLists: boolean,
    databaseNameList: string[],
    fhirResourceNameList: string[],
    databaseSchema: IDatabaseSchema,
    fhirResourceJson: any,
    // This is what users acutally modify
    // and upload.
    loadingMapping: boolean,
    mapping: IMapping,
}

export interface action {
    type: string,
    value?: any,
}
