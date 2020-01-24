import { IAction } from 'types';

import { fetchSourceSchema } from './sourceSchemas/actions';

// Fhir Source
export const updateSelectedSource = (
  id: string,
  name: string,
  schemaFileName: string,
  hasOwner: boolean
): IAction => {
  return {
    type: 'UPDATE_SELECTED_SOURCE',
    payload: {
      id,
      name,
      schemaFileName,
      hasOwner
    }
  };
};

export const changeSelectedSource = (
  id: string,
  sourceName: string,
  templateName: string,
  hasOwner: boolean
): IAction => {
  const schemaFileName = templateName.concat('_', sourceName);
  return (dispatch: any, getState: any) => {
    dispatch(
      fetchSourceSchema(schemaFileName, () =>
        dispatch(updateSelectedSource(id, sourceName, schemaFileName, hasOwner))
      )
    );
  };
};

export const deselectSource = (): IAction => {
  return {
    type: 'DESELECTED_SOURCE'
  };
};

// Fhir Resource
export const updateFhirResource = (
  resourceId: string,
  label: string,
  definition: any
): IAction => {
  return {
    type: 'UPDATE_FHIR_RESOURCE',
    payload: {
      resourceId,
      label,
      definition
    }
  };
};

export const deselectFhirResource = (): IAction => {
  return {
    type: 'DESELECTED_FHIR_RESOURCE'
  };
};

// Fhir Attribute
export const updateFhirAttribute = (attributePath: string[]): IAction => {
  return {
    type: 'UPDATE_FHIR_ATTRIBUTE',
    payload: {
      attributePath
    }
  };
};
