import { ISimpleAction } from 'types';

const initialState: any = {
  primaryKeyOwner: null,
  primaryKeyTable: null,
  primaryKeyColumn: null,
  attributesMap: null
};

const resourceInputsReducer = (
  state = initialState,
  action: ISimpleAction
): any => {
  switch (action.type) {
    case 'INIT_ATTRIBUTES_MAP':
      return {
        ...initialState,
        attributesMap: action.payload
      };

    case 'SET_ATTRIBUTE_IN_MAP':
      return {
        ...state,
        attributesMap: {
          ...state.attributesMap,
          [action.payload.path]: action.payload.attr
        }
      };

    default:
      return state;
  }
};

export default resourceInputsReducer;
