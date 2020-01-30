import { IToaster } from '@blueprintjs/core';
import * as redux from 'redux';

// REDUX
export interface ISimpleAction {
  type: string;
  payload?: any;
}

export type IThunkAction = (
  dispatch: redux.Dispatch<any>,
  getState: any
) => void;

export type IAction = ISimpleAction | IThunkAction | Promise<any>;

// Reducers
export interface IUser {
  id: string;
  name: string;
  email: string;
}

export interface ISelectedSource {
  id: string;
  name: string;
  schemaFileName: string;
  hasOwner: boolean;
}

export interface ISelectedResource {
  id: string;
  label: string;
  definition: {
    id: string;
    type: string;
  };
}

export interface ISelectedAttribute {
  path: string;
}

export interface ISelectedNode {
  source: ISelectedSource;
  resource: ISelectedResource;
  attribute: ISelectedAttribute;
}

export interface IResourceInputs {
  primaryKeyOwner: string;
  primaryKeyTable: string;
  primaryKeyColumn: string;
  attributesMap: any;
}

export interface ISourceSchemas {
  loadingSourceSchema: boolean;
  schemaByFileName: {
    [fileName: string]: any;
  };
}

export interface IRecommendedColumns {
  columnsByAttribute: {
    [fhirAttribute: string]: any;
  };
}

export interface IData {
  sourceSchemas: ISourceSchemas;
  recommendedColumns: IRecommendedColumns;
}

// Store
export interface IReduxStore {
  data: IData;
  dispatch?: any;
  selectedNode: ISelectedNode;
  resourceInputs: IResourceInputs;
  structure: any;
  toaster: IToaster;
  user: IUser;
  views: any;
}

// VIEWS

export interface IView {
  // Apollo client (withApollo from 'react-apollo')
  client?: any;
  data?: IData;
  dispatch?: any;
  // Router history (withRouter from 'react-router-dom')
  history?: any;
  // Router location (withRouter from 'react-router-dom')
  location?: any;
  selectedNode?: ISelectedNode;
  toaster?: IToaster;
  user?: IUser;
}

// REACT

// TODO: Deprecate type
export interface IFhirResource {
  resourceType: string;
  owner: string;
  table: string;
  primaryKey: string;
  contentAsTree: any;
  inputColumnsDict?: any;
}

// TODO: Deprecate type
export interface ISource {
  name: string;
  schema: any;
}

export interface ITemplate {
  name: string;
  sources: ISource[];
}

export interface ISourceSchemaWithOwner {
  [owner: string]: {
    [table: string]: string[];
  };
}

export interface ISourceSchemaWithoutOwner {
  [table: string]: string[];
}

export type ISourceSchema = ISourceSchemaWithOwner | ISourceSchemaWithoutOwner;

export interface ISourceColumn {
  owner: string;
  table: string;
  column: string;
}

export interface IInputColumn extends ISourceColumn {
  join?: {
    sourceColumn: string;
    targetColumn: ISourceColumn;
  };
  script?: any;
}

export interface IFhirIntegrationSpec {
  inputColumns: IInputColumn[];
  mergingScript?: any;
  [Symbol.iterator]?: any;
}

export interface IMapping {
  primaryKeyColumn: ISourceColumn;
  fhirMapping: {
    [fhirAttribute: string]: IFhirIntegrationSpec;
  };
}
