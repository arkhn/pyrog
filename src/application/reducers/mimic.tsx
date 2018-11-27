import {
    IMimicState,
    ISimpleAction,
} from '../types'

import {questions} from '../mockdata/mimic'

let initialState: IMimicState = {
    question_index: 0,
    section_index: 0,
    dataByAttribute: {},
}

questions[initialState.question_index].sections[initialState.section_index].mapping_items.forEach((item: any) => {
    initialState.dataByAttribute[item.fhir_attribute] = {
        type: item.type,
        mot_clef: '',
    }
})

export const mimic = (state = initialState, action: ISimpleAction): any => {
    switch (action.type) {
        case 'FETCH_RECOMMENDED_COLUMNS_SUCCESS': {
            let dataByAttribute = state.dataByAttribute

            if (dataByAttribute[action.payload.fhir_attribute]) {
                dataByAttribute[action.payload.fhir_attribute].suggested_columns = action.payload.columns
            } else {
                dataByAttribute[action.payload.fhir_attribute] = {
                    suggested_columns: action.payload.columns,
                }
            }

            return {
                ...state,
                dataByAttribute,
            }
        }

        case 'ADD_INPUT_COLUMN_MIMIC': {
            let dataByAttribute = state.dataByAttribute

            if (dataByAttribute[action.payload.fhir_attribute] && dataByAttribute[action.payload.fhir_attribute].input_columns) {
                dataByAttribute[action.payload.fhir_attribute].input_columns.push(action.payload.input_column)
            } else {
                dataByAttribute[action.payload.fhir_attribute].input_columns = [action.payload.input_column]
            }

            return {
                ...state,
                dataByAttribute,
            }
        }

        case 'UPDATE_TYPE_MIMIC': {
            return {
                ...state,
                dataByAttribute: {
                    ...state.dataByAttribute,
                    [action.payload.fhir_attribute]: {
                        ...state.dataByAttribute[action.payload.fhir_attribute],
                        type: action.payload.type,
                    }
                }
            }
        }

        case 'UPDATE_MOT_CLEF_MIMIC': {
            return {
                ...state,
                dataByAttribute: {
                    ...state.dataByAttribute,
                    [action.payload.fhir_attribute]: {
                        ...state.dataByAttribute[action.payload.fhir_attribute],
                        mot_clef: action.payload.mot_clef,
                    }
                }
            }
        }

        default:
            return state
    }
}
