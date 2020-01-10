import { IAction } from 'types';
import { availableTypes } from 'mockdata/mimic';
import { ENGINE_BACKEND_URL } from '../../constants';

export const fetchRecommendedColumns = (
  fhirAttribute: string,
  type: string
): IAction => {
  return (dispatch: any, getState: any) => {
    const url = `${ENGINE_BACKEND_URL}/search/${availableTypes[type]}`;

    return fetch(url)
      .then((response: any) => {
        return response.json();
      })
      .then((response: any) => {
        dispatch(fetchRecommendedColumnsSuccess(fhirAttribute, response));
      })
      .catch((err: any) => {
        console.log(err);
        dispatch(fetchRecommendedColumnsFailure(err));
      });
  };
};

export const fetchBetaRecommendedColumns = (
  fhirAttribute: string,
  type: string,
  head_table: string,
  mot_clef: string
): IAction => {
  return (dispatch: any, getState: any) => {
    const url =
      mot_clef == '' || !mot_clef
        ? `${ENGINE_BACKEND_URL}/beta/search/${availableTypes[type]}/${head_table}`
        : `${ENGINE_BACKEND_URL}/beta/search/${
            type ? availableTypes[type] : 'all'
          }/${head_table}/${mot_clef}`;

    return fetch(url)
      .then((response: any) => {
        return response.json();
      })
      .then((response: any) => {
        dispatch(fetchRecommendedColumnsSuccess(fhirAttribute, response));
      })
      .catch((err: any) => {
        console.log(err);
        dispatch(fetchRecommendedColumnsFailure(err));
      });
  };
};

export const fetchRecommendedColumnsSuccess = (
  fhirAttribute: string,
  columns: any
): IAction => {
  return {
    type: 'FETCH_RECOMMENDED_COLUMNS_SUCCESS',
    payload: {
      fhirAttribute,
      columns
    }
  };
};

export const fetchRecommendedColumnsFailure = (error: any): IAction => {
  return {
    type: 'FETCH_RECOMMENDED_COLUMNS_FAILURE',
    payload: error
  };
};
