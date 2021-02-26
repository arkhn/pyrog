import axios from 'axios';

import { IAction, IThunkAction } from 'types';
import { RIVER_URL } from '../../constants';

export const exploreTable = (
  resourceId: string,
  owner: string,
  table: string
): IThunkAction => {
  return async (dispatch): Promise<IAction> => {
    dispatch({
      type: 'EXPLORE_TABLE_LOADING',
      payload: {
        resourceId,
        owner,
        table
      }
    });
    try {
      const { data } = await axios.get(
        `${RIVER_URL}/pagai/explore/${resourceId}/${owner}/${table}/`
      );
      dispatch({
        type: 'EXPLORE_TABLE_SUCCESS',
        payload: {
          ...data,
          resourceId,
          owner,
          table
        }
      });
    } catch (err) {
      dispatch({
        type: 'EXPLORE_TABLE_FAILED',
        payload: err.response ? err.response.data.error : err.message
      });
    }
  };
};

export default exploreTable;
