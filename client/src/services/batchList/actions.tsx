import axios from 'axios';

import { IAction } from 'types';
import { RIVER_URL } from '../../constants';

const listBatch = (): IAction => {
  return async (dispatch: any) => {
    try {
      const { data } = await axios.get(`${RIVER_URL}/batch`);
      dispatch({
        type: 'LIST_BATCH_SUCCESS',
        payload: data
      });
    } catch (err) {
      const errMessage = err.response ? err.response.data : err.message;
      dispatch({
        type: 'LIST_BATCH_FAILED',
        payload: errMessage
      });
    }
  };
};

export default listBatch;
