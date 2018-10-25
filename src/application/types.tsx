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

export interface IInputColumn {
    owner: string,
    table: string,
    column: string,
}

export interface IInputColumnsDict {
    [key: string]: IInputColumn[],
}

// Describes all elements of a Fhir Resource in the view.
// In particular, it contains the mapping.

export interface IFhirResource {
    resourceType: string,
    // attributes indicating path to the primary key for this resource
    owner: string,
    table: string,
    primaryKey: string,
    // json description
    content?: any,
    // json description turned into a react tree;
    // it is supposed to be a simple transformation of
    // the attribute 'content'
    contentAsTree?: any,
    // dict containing columns from which to pick information;
    // key = fhir resource path
    // value = input columns from which to find information
    inputColumnsDict?: IInputColumnsDict,
}

export interface appState {
    currentInputDatabase :IDatabase,
    currentFhirResource: IFhirResource,
    currentTreeNodePath: string[],
    dispatch?: redux.Dispatch<any>,
}

export interface action {
    type: string,
    promise?: (dispatch: any, getState: any) => any,
    value?: any,
}
