import { IRecommendedColumns, ISimpleAction } from '../../types';

const initialState: IRecommendedColumns = {
  columnsByAttribute: {}
};

export const recommendedColumns = (
  state = initialState,
  action: ISimpleAction
): any => {
  switch (action.type) {
    case 'FETCH_RECOMMENDED_COLUMNS_SUCCESS': {
      return {
        ...state,
        columnsByAttribute: {
          ...state.columnsByAttribute,
          [action.payload.fhirAttribute]: [...action.payload.columns]
        }
      };
    }

    default:
      return state;
  }
};

export default recommendedColumns;
