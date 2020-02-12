import { IAction, ISourceSchema } from 'types';
// import { HTTP_BACKEND_URL } from '../../constants';

interface Resource {
  id: string;
  label: string;
  primaryKeyOwner: string;
  primaryKeyTable: string;
  primaryKeyColumn: string;
  definition: {
    id: string;
    type: string;
  };
}

// Fhir Source
export const updateSelectedSource = (source: {
  id: string;
  name: string;
  hasOwner: boolean;
  template: {
    name: string;
  };
  credential: {
    id: string;
  };
  schema?: ISourceSchema;
}): IAction => {
  return {
    type: 'UPDATE_SOURCE',
    payload: source
  };
};

export const changeSelectedSource = (
  source: {
    id: string;
    name: string;
    hasOwner: boolean;
    template: {
      name: string;
    };
    credential: {
      id: string;
    };
  },
  body: any
): IAction => {
  return {
    type: 'CHANGE_SOURCE',
    payload: { ...source, schema: body }
  };
};

export const deselectSource = (): IAction => {
  return {
    type: 'DESELECT_SOURCE'
  };
};

// Fhir Resource
export const updateSelectedResource = (resource: Resource): IAction => {
  return {
    type: 'UPDATE_RESOURCE',
    payload: {
      resource
    }
  };
};

export const changeSelectedResource = (resource: Resource): IAction => {
  return {
    type: 'CHANGE_RESOURCE',
    payload: {
      resource
    }
  };
};

export const deselectResource = (): IAction => {
  return {
    type: 'DESELECT_RESOURCE'
  };
};

// Fhir Attribute
export const updateFhirAttribute = (attributePath: string[]): IAction => {
  return {
    type: 'UPDATE_ATTRIBUTE',
    payload: {
      attributePath
    }
  };
};
