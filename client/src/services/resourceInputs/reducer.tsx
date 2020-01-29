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

    case 'REMOVE_ATTRIBUTE_FROM_MAP':
      return {
        ...state,
        attributesMap: {
          ...Object.keys(state.attributesMap)
            .filter(key => !key.startsWith(action.payload.pathStart))
            .reduce(
              (acc, key) => ({ ...acc, [key]: state.attributesMap[key] }),
              {}
            )
        }
      };

    default:
      return state;
  }
};

export default resourceInputsReducer;
