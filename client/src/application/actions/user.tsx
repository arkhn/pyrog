import { IAction } from "../types";

export const login = (id: string, name: string, email: string): IAction => {
  return {
    type: "LOGIN",
    payload: {
      id,
      name,
      email
    }
  };
};

export const logout = (): IAction => {
  return {
    type: "LOGOUT",
    payload: {}
  };
};
