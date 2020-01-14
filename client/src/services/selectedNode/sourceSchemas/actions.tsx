import { IAction } from 'types';
import { HTTP_BACKEND_URL } from '../../../constants';

// These actions handle source schema fetching.
export const loadingSourceSchema = (): IAction => {
  return {
    type: 'LOADING_SOURCE_SCHEMA'
  };
};

export const fetchSourceSchema = (fileName: string, callback: any): IAction => {
  return async (dispatch: any, getState: any) => {
    dispatch(loadingSourceSchema());

    try {
      const response = await fetch(
        `${HTTP_BACKEND_URL}/schemas/${fileName}.json`
      );
      const body = await response.json();
      if (response.status !== 200) {
        throw new Error(body.error);
      }
      dispatch(fetchSourceSchemaSuccess(fileName, body));
      callback();
    } catch (err) {
      dispatch(fetchSourceSchemaFailure(err));
      callback();
    }
  };
};

export const fetchSourceSchemaSuccess = (
  fileName: string,
  schema: any
): IAction => {
  return {
    type: 'FETCH_SOURCE_SCHEMA_SUCCESS',
    payload: {
      fileName,
      schema
    }
  };
};

export const fetchSourceSchemaFailure = (err: any): IAction => {
  return {
    type: 'FETCH_SOURCE_SCHEMA_FAILURE'
  };
};
