import { client } from "../../app";
import {
  IAction,
  ISelectedSource,
  ISelectedResource,
  ISelectedAttribute
} from "../../types";

import { fetchSourceSchema } from "./sourceSchemas/actions";

const attributeInfo = require("../../graphql/queries/attributeInfo.graphql");
const resourceInfo = require("../../graphql/queries/resourceInfo.graphql");
const sourceInfo = require("../../graphql/queries/sourceInfo.graphql");

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
            query: attributeInfo,
            variables: { attributeId }
          })
        : null
    ])
      .then(([source, resource, attribute]: any) => {
        dispatch(
          changeSelectedSource(
            source.data.sourceInfo.id,
            source.data.sourceInfo.name,
            source.data.sourceInfo.hasOwner,
            () => {
              return dispatch(
                updateNode(
                  source.data.sourceInfo,
                  resource
                    ? resource.data.resourceInfo
                    : { id: null, name: null },
                  attribute
                    ? attribute.data.attributeInfo
                    : { id: null, name: null }
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
    type: "UPDATE_NODE",
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
  name: string,
  hasOwner: boolean,
  callback: any = null
): IAction => {
  return (dispatch: any, getState: any) => {
    dispatch(
      fetchSourceSchema(name, () => {
        return callback
          ? callback()
          : dispatch(updateSelectedSource(id, name, hasOwner));
      })
    );
  };
};

export const updateSelectedSource = (
  id: string,
  name: string,
  hasOwner: boolean
): IAction => {
  return {
    type: "UPDATE_SELECTED_SOURCE",
    payload: {
      id,
      name,
      hasOwner
    }
  };
};

export const deselectSource = (): IAction => {
  return {
    type: "DESELECTED_SOURCE"
  };
};

// Fhir Resource
export const updateFhirResource = (
  resourceId: string,
  fhirType: string,
  label: string
): IAction => {
  return {
    type: "UPDATE_FHIR_RESOURCE",
    payload: {
      fhirType,
      resourceId,
      label
    }
  };
};

export const deselectFhirResource = (): IAction => {
  return {
    type: "DESELECTED_FHIR_RESOURCE"
  };
};

// Fhir Attribute
export const updateFhirAttribute = (
  attributeId: string,
  attributeName: string
): IAction => {
  return {
    type: "UPDATE_FHIR_ATTRIBUTE",
    payload: {
      attributeId,
      attributeName
    }
  };
};
