import axios from 'axios';
import { ResourceDefinition } from '@arkhn/fhir.ts';

import { IAction, ISimpleAction } from 'types';
import { FHIR_API_URL } from '../../constants';

const initialState: {
  extensions: { [path: string]: ResourceDefinition[] };
  availableResources: ResourceDefinition[];
} = {
  extensions: {},
  availableResources: []
};

export const fetchAvailableExtensions = async (
  dispatch: Function,
  getState: Function
): Promise<IAction> => {
  try {
    const response = await axios.get(
      `${FHIR_API_URL}/StructureDefinition?type=Extension&derivation=constraint&_count=1000&_elements=id,name,publisher,context`
    );
    const extensions = response.data?.entry
      .map(({ resource }: any) => resource)
      .reduce((acc: any, val: ResourceDefinition) => {
        for (const context of val.context!) {
          acc[context.expression] = [...(acc[context.expression] || []), val];
        }
        return acc;
      }, {});
    dispatch({ type: 'FETCH_EXTENSIONS', payload: extensions });
  } catch (err) {
    console.error(
      `Could not fetch available extensions: ${
        err.response ? err.response.data : err.message
      }`
    );
    dispatch({ type: 'FETCH_EXTENSIONS', payload: getState() });
  }
};

export const fetchAvailableResources = async (
  dispatch: Function,
  getState: Function
): Promise<IAction> => {
  try {
    const response = await axios.get(
      `${FHIR_API_URL}/StructureDefinition?kind=resource&derivation=specialization&_count=1000&_elements=id,name,type`
    );
    const availableResources = response.data?.entry.map(
      ({ resource }: any) => resource
    );
    dispatch({
      type: 'FETCH_AVAILABLE_RESOURCES',
      payload: availableResources
    });

    return;
  } catch (err) {
    console.error(
      `Could not fetch available resources: ${
        err.response ? err.response.data : err.message
      }`
    );
    dispatch({ type: 'FETCH_AVAILABLE_RESOURCES', payload: getState() });
  }
};

const extensionsReducer = (
  state = initialState,
  action: ISimpleAction
): any => {
  switch (action.type) {
    case 'FETCH_EXTENSIONS':
      return {
        ...state,
        extensions: action.payload
      };
    case 'FETCH_AVAILABLE_RESOURCES':
      return {
        ...state,
        availableResources: action.payload
      };
    default:
      return state;
  }
};

export default extensionsReducer;
