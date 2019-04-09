import { IToaster } from '@blueprintjs/core'
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
    id: string,
    name: string,
    email: string,
}

export interface ISelectedSource {
    id: string,
    name: string,
}

export interface ISourceSchemas {
    loadingSourceSchema: boolean,
    schemaBySourceName: {
        [sourceName: string]: any,
    }
}

export interface IRecommendedColumns {
    columnsByAttribute: {
        [fhirAttribute: string]: any,
    }
}

export interface IData {
    sourceSchemas: ISourceSchemas,
    recommendedColumns: IRecommendedColumns,
}

// Store
export interface IReduxStore {
    data: IData,
    dispatch?: any,
    selectedSource: ISelectedSource,
    toaster: IToaster,
    user: IUser,
    views: any,
}

// VIEWS

export interface IView {
    // Apollo client (withApollo from 'react-apollo')
    client?: any,
    data?: IData,
    dispatch?: any,
    // Router history (withRouter from 'react-router-dom')
    history?: any,
    // Router location (withRouter from 'react-router-dom')
    location?: any,
    selectedSource?: ISelectedSource,
    toaster?: IToaster,
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
export interface ISource {
    name: string,
    schema: any,
}

export interface ISourceSchema {
    [owner: string]: {
        [table: string]: string[],
    }
}

export interface ISourceColumn {
    owner: string,
    table: string,
    column: string,
}

export interface IInputColumn extends ISourceColumn {
    join?: {
        sourceColumn: string,
        targetColumn: ISourceColumn,
    }
    script?: any,
}

export interface IFhirIntegrationSpec {
    inputColumns: IInputColumn[],
    mergingScript?: any,
    [Symbol.iterator]?: any,
}

export interface IMapping {
    primaryKeyColumn: ISourceColumn,
    fhirMapping: {
        [fhirAttribute: string]: IFhirIntegrationSpec,
    }
}
