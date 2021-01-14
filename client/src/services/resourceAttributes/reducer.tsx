import { ISimpleAction } from 'types';

const initialState: any = {};

const resourceInputsReducer = (
  state = initialState,
  action: ISimpleAction
): any => {
  switch (action.type) {
    case 'INIT_ATTRIBUTES_MAP':
      return {
        ...action.payload
      };

    case 'SET_ATTRIBUTE_IN_MAP':
      return {
        ...state,
        [action.payload.path]: action.payload.attr
      };

    case 'REMOVE_ATTRIBUTES_FROM_MAP':
      return {
        ...Object.keys(state)
          .filter(key => !key.startsWith(action.payload.pathStart))
          .reduce(
            (acc, key) => ({ ...acc, [key]: state[key] }),
            {}
          )
      };

    default:
      return state;
  }
};

export default resourceInputsReducer;
