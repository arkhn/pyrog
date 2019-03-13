import * as redux from 'redux'

// REDUX
export interface ISimpleAction {
    type: string,
    payload?: any,
}

export type IThunkAction = (dispatch: redux.Dispatch<any>, getState: any) => void

export type IAction = ISimpleAction | IThunkAction | Promise<any>

// Reducers
export interface IUser {
    isAuthenticated: boolean,
    info: {
        id: string,
        name: string,
        email: string,
    }
}

export interface ISelectedDatabase {
    id: string,
    name: string,
}

export interface IDatabaseSchemas {
    loadingDatabaseSchema: boolean,
    schemaByDatabaseName: {
        [databaseName: string]: any,
    }
}

export interface IRecommendedColumns {
    columnsByAttribute: {
        [fhirAttribute: string]: any,
    }
}

export interface IData {
    databaseSchemas: IDatabaseSchemas,
    recommendedColumns: IRecommendedColumns,
}

// Store
export interface IReduxStore {
    data: IData,
    dispatch?: any,
    selectedDatabase: ISelectedDatabase,
    user: IUser,
    views: any,
}

// VIEWS

export interface IView {
    data?: IData,
    dispatch?: any,
    selectedDatabase?: ISelectedDatabase,
    user?: IUser,
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
