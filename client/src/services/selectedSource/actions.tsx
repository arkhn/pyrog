import { IAction } from "../../types";

import { fetchSourceSchema } from "../sourceSchemas/actions";

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
