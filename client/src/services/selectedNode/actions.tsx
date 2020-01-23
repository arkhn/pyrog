import { loader } from 'graphql.macro';

import { client } from 'app';
import {
  IAction,
  ISelectedSource,
  ISelectedResource,
  ISelectedAttribute
} from 'types';

import { fetchSourceSchema } from './sourceSchemas/actions';

const qAttribute = loader('../../graphql/queries/attribute.graphql');
const resourceInfo = loader('../../graphql/queries/resourceInfo.graphql');
const sourceInfo = loader('../../graphql/queries/sourceInfo.graphql');

// Node
export const changeNode = (
  sourceId: string | string[],
  resourceId: string | string[],
  attributeId: string | string[]
): IAction => {
  return (dispatch: any, getState: any) => {
    Promise.all([
      sourceId
        ? client.query({
            query: sourceInfo,
            variables: { sourceId }
          })
        : null,
      resourceId
        ? client.query({
            query: resourceInfo,
            variables: { resourceId }
          })
        : null,
      attributeId
        ? client.query({
            query: qAttribute,
            variables: { attributeId }
          })
        : null
    ])
      .then(([source, resource, attribute]: any) => {
        dispatch(
          changeSelectedSource(
            source.data.source.id,
            source.data.source.name,
            source.data.source.template.name,
            source.data.source.hasOwner,
            () => {
              return dispatch(
                updateNode(
                  source.data.source,
                  resource
                    ? resource.data.resourceInfo
                    : { id: null, label: null, fhirType: null },
                  attribute ? attribute : { id: null, name: null }
                )
              );
            }
          )
        );
      })
      .catch(err => {
        console.log(err);
      });
  };
};

export const updateNode = (
  source: ISelectedSource,
  resource: ISelectedResource,
  attribute: ISelectedAttribute
): IAction => {
  return {
    type: 'UPDATE_NODE',
    payload: {
      source,
      resource,
      attribute
    }
  };
};

// Source
export const changeSelectedSource = (
  id: string,
  sourceName: string,
  templateName: string,
  hasOwner: boolean,
  callback: any = null
): IAction => {
  const schemaFileName = templateName.concat('_', sourceName);
  return (dispatch: any, getState: any) => {
    dispatch(
      fetchSourceSchema(schemaFileName, () => {
        return callback
          ? callback()
          : dispatch(
              updateSelectedSource(id, sourceName, schemaFileName, hasOwner)
            );
      })
    );
  };
};

export const updateSelectedSource = (
  id: string,
  name: string,
  schemaFileName: string,
  hasOwner: boolean
): IAction => {
  return {
    type: 'UPDATE_SELECTED_SOURCE',
    payload: {
      id,
      name,
      schemaFileName,
      hasOwner
    }
  };
};

export const deselectSource = (): IAction => {
  return {
    type: 'DESELECTED_SOURCE'
  };
};

// Fhir Resource
export const updateFhirResource = (
  resourceId: string,
  label: string,
  definition: any,
): IAction => {
  return {
    type: 'UPDATE_FHIR_RESOURCE',
    payload: {
      resourceId,
      label,
      definition,
    }
  };
};

export const deselectFhirResource = (): IAction => {
  return {
    type: 'DESELECTED_FHIR_RESOURCE'
  };
};

// Fhir Attribute
export const updateFhirAttribute = (
  attributeId: string,
  attributeName: string
): IAction => {
  return {
    type: 'UPDATE_FHIR_ATTRIBUTE',
    payload: {
      attributeId,
      attributeName
    }
  };
};
