import axios from 'axios';

import { IAction, IThunkAction } from 'types';
import { RIVER_URL } from '../../constants';

export const listScripts = (): IThunkAction => {
  return async (dispatch): Promise<IAction> => {
    try {
      const { data } = await axios.get(`${RIVER_URL}/api/scripts/`);
      dispatch({
        type: 'LIST_SCRIPTS_SUCCESS',
        payload: data
      });
    } catch (err) {
      const errMessage = err.response ? err.response.data : err.message;
      dispatch({
        type: 'LIST_SCRIPTS_FAILED',
        payload: errMessage
      });
    }
  };
};

export default listScripts;
