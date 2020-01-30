import { IAction } from 'types';

export const initAttributesMap = (responseAttributes: any): IAction => {
  const attributesMap: Record<string, any> = {};

  for (const attr of responseAttributes) {
    attributesMap[attr.path] = attr;
  }
  return {
    type: 'INIT_ATTRIBUTES_MAP',
    payload: {
      ...attributesMap
    }
  };
};

export const setAttributeInMap = (path: string, attr: any): IAction => {
  return {
    type: 'SET_ATTRIBUTE_IN_MAP',
    payload: {
      path,
      attr
    }
  };
};

export const removeAttributesFromMap = (pathStart: string): IAction => {
  return {
    type: 'REMOVE_ATTRIBUTES_FROM_MAP',
    payload: {
      pathStart
    }
  };
};

export const removeAttributeFromMap = (path: string): IAction => {
  return {
    type: 'REMOVE_ATTRIBUTE_FROM_MAP',
    payload: {
      path
    }
  };
};
