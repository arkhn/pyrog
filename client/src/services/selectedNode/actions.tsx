import { Attribute } from '@arkhn/fhir.ts';

import { IAction, ICredential, ISourceSchema, Resource } from 'types';

// Fhir Source
export const updateSelectedSource = (source: {
  id: string;
  name: string;
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

export const changeSelectedSource = (source: {
  id: string;
  name: string;
  template: {
    name: string;
  };
  credential: ICredential;
}): IAction => {
  return {
    type: 'CHANGE_SOURCE',
    payload: source
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
export const updateFhirAttribute = (attribute?: Attribute): IAction => {
  return {
    type: 'UPDATE_ATTRIBUTE',
    payload: {
      attribute
    }
  };
};
