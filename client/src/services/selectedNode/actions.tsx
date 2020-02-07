import { IAction, ISourceSchema } from 'types';
import { HTTP_BACKEND_URL } from '../../constants';

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
    type: 'UPDATE_SELECTED_SOURCE',
    payload: source
  };
};

export const changeSelectedSource = (source: {
  id: string;
  name: string;
  hasOwner: boolean;
  template: {
    name: string;
  };
  credential: {
    id: string;
  };
}): IAction => {
  return async dispatch => {
    try {
      const response = await fetch(
        `${HTTP_BACKEND_URL}/schemas/${source.template.name}_${source.name}.json`
      );
      const body = await response.json();
      if (response.status !== 200) {
        throw new Error(body.error);
      }
      dispatch(updateSelectedSource({ ...source, schema: body }));
    } catch (err) {
      console.log(`error fetching source schema: ${err}`);
      dispatch(updateSelectedSource(source));
    }
  };
};

export const deselectSource = (): IAction => {
  return {
    type: 'DESELECTED_SOURCE'
  };
};

// Fhir Resource
export const updateFhirResource = (resource: Resource): IAction => {
  return {
    type: 'UPDATE_FHIR_RESOURCE',
    payload: {
      resource
    }
  };
};

export const deselectFhirResource = (): IAction => {
  return {
    type: 'DESELECTED_FHIR_RESOURCE'
  };
};

// Fhir Attribute
export const updateFhirAttribute = (attributePath: string[]): IAction => {
  return {
    type: 'UPDATE_FHIR_ATTRIBUTE',
    payload: {
      attributePath
    }
  };
};
