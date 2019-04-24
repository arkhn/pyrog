import { IAction } from "../../types";

// TODO: service should not include cousin service
import { fetchSourceSchema } from "../sourceSchemas/actions";

// Source
export const changeSelectedSource = (
  id: string,
  name: string,
  hasOwner: boolean
): IAction => {
  return (dispatch: any, getState: any) => {
    dispatch(
      fetchSourceSchema(name, () => {
        return dispatch(updateSelectedSource(id, name, hasOwner));
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
  resourceName: string
): IAction => {
  return {
    type: "UPDATE_FHIR_RESOURCE",
    payload: {
      resourceName,
      resourceId
    }
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
