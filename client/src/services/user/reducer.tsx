import { ISimpleAction } from 'types';

const initialState: any = {
  id: null,
  email: null,
  name: null,
  role: null
};

export const user = (state = initialState, action: ISimpleAction): any => {
  switch (action.type) {
    case 'LOGIN': {
      return {
        id: action.payload.id,
        email: action.payload.email,
        name: action.payload.name,
        role: action.payload.role
      };
    }

    case 'LOGOUT': {
      return {
        ...initialState
      };
    }

    default:
      return state;
  }
};

export default user;
