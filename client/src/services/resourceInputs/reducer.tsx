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

    case 'REMOVE_ATTRIBUTES_FROM_MAP':
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

    case 'REMOVE_ATTRIBUTE_FROM_MAP':
      delete state.attributesMap[action.payload.path];
      return {
        ...state,
        attributesMap: {
          ...state.attributesMap
        }
      };

    default:
      return state;
  }
};

export default resourceInputsReducer;
