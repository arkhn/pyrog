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

export interface IInputColumns {
    owner: string,
    table: string,
    column: string,
}

export interface IInputColumnsDict {
    [key: string]: IInputColumns[],
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
    //
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
