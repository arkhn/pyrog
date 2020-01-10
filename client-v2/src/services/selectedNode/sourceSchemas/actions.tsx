import { IAction } from 'src/types';
import { HTTP_BACKEND_URL } from 'src/constants';

// These actions handle source schema fetching.
export const loadingSourceSchema = (): IAction => {
  return {
    type: 'LOADING_SOURCE_SCHEMA'
  };
};

export const fetchSourceSchema = (fileName: string, callback: any): IAction => {
  return (dispatch: any, getState: any) => {
    dispatch(loadingSourceSchema());

    return fetch(`${HTTP_BACKEND_URL}/schemas/${fileName}.json`)
      .then((response: any) => {
        return response.json();
      })
      .then((response: any) => {
        dispatch(fetchSourceSchemaSuccess(fileName, response));
        callback();
      })
      .catch((err: any) => {
        console.log(err);
        dispatch(fetchSourceSchemaFailure(err));
      });
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
