import {
    IMimicState,
    ISimpleAction,
} from '../types'

import {questions} from '../mockdata/mimic'

let initialState: any = {
    columnsByAttribute: {},
}

export const recommendedColumns = (state = initialState, action: ISimpleAction): any => {
    switch (action.type) {
        case 'FETCH_RECOMMENDED_COLUMNS_SUCCESS': {
            return {
                ...state,
                columnsByAttribute: {
                    ...state.columnsByAttribute,
                    [action.payload.fhirAttribute]: [
                        ...action.payload.columns,
                    ]
                },
            }
        }

        default:
            return state
    }
}

export default recommendedColumns
