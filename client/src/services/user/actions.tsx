import { IAction, IUser } from 'types';

export const login = ({ id, name, email, role }: IUser): IAction => {
  return {
    type: 'LOGIN',
    payload: {
      id,
      name,
      email,
      role
    }
  };
};

export const logout = (): IAction => {
  return {
    type: 'LOGOUT',
    payload: {}
  };
};
