import { IToastProps } from "@blueprintjs/core";

import { IAction } from "../types";

export const addToast = (props: IToastProps): IAction => {
  return {
    type: "ADD_TOAST",
    payload: {
      props
    }
  };
};
