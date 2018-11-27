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

// MappingExplorer
export interface IMappingExplorerState {
    selectedDatabase: string,
    selectedFhirAttribute: string,
    selectedFhirResource: string,
}

export interface IMappingExplorerViewState extends IView, IMappingExplorerState {}

// Mimic types

export interface IMimicState {
    stateByAttribute: {
        [attribute_flat: string]: {
            input_columns?: any,
            type?: string,
            mot_clef?: string,
        },
    },
    question_index: number,
    section_index: number,
}

export interface IMimicViewState extends IView, IMimicState {}

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
