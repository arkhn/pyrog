import { IToaster } from '@blueprintjs/core';
import * as redux from 'redux';
import { Attribute, AttributeDefinition } from '@arkhn/fhir.ts';

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

export type ISourceRole = 'READER' | 'WRITER';

export interface IAttribute {
  id: string;
  path: string;
  sliceName: string;
  definitionId: string;
}
export interface IAttributeDefinition {
  attribute: AttributeDefinition;
  extensions?: IStructureDefinition[];
}
export interface IStructureDefinition {
  id: string;
  attributes: IAttributeDefinition[];
  extensions?: IStructureDefinition[];
}

export interface ISelectedSource {
  id: string;
  name: string;
  hasOwner: boolean;
  mappingProgress: number[];
  template: {
    name: string;
  };
  credential: {
    id: string;
  };
  accessControls: IAccessControl[];
  schema?: ISourceSchema;
  resources: Resource[];
}

export interface IAccessControl {
  id: string;
  user: IUser;
  role: ISourceRole;
  __typename: 'AccessControl';
}

export interface Profile {
  id: string;
  name: string;
  type: string;
  publisher?: string;
}

export interface Resource {
  id: string;
  label: string;
  name: string;
  type: string;
  profiles: Profile[];
  primaryKeyOwner: string;
  primaryKeyTable: string;
  primaryKeyColumn: string;
  filters: Filters[];
  definitionId: string;
  definition: {
    id: string;
    type: string;
    name: string;
  };
}

export interface Filters {
  sqlColumn: ISourceColumn;
  relation: string;
  value: string;
}

export interface ISelectedNode {
  source: ISelectedSource;
  resource: Resource;
  attribute: Attribute;
}

export interface IResourceInputs {
  primaryKeyOwner: string;
  primaryKeyTable: string;
  primaryKeyColumn: string;
  attributesMap: any;
}
export interface IComment {
  id: string;
  author: IUser;
  content: string;
  createdAt: string;
}

export interface IRecommendedColumns {
  columnsByAttribute: {
    [fhirAttribute: string]: any;
  };
}

export interface IData {
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
