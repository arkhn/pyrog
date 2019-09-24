import { IAction } from "../../types";

export const updateAddResource = (resource: any): IAction => {
  return {
    type: "UPDATE_ADD_RESOURCE",
    payload: {
      ...resource
    }
  };
};

export const addResource = (): IAction => {
  return {
    type: "ADD_RESOURCE"
  };
};

export const deleteResource = (): IAction => {
  return {
    type: "DELETE_RESOURCE"
  };
};

export const addProfile = (): IAction => {
  return {
    type: "ADD_PROFILE"
  };
};

export const deleteProfile = (): IAction => {
  return {
    type: "DELETE_PROFILE"
  };
};

export const nodeCollapse = (node: any): IAction => {
  return {
    type: "NODE_COLLAPSE",
    payload: {
      ...node
    }
  };
};

export const nodeExpand = (node: any): IAction => {
  return {
    type: "NODE_EXPAND",
    payload: {
      ...node
    }
  };
};
