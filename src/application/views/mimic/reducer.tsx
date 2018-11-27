import {
    IMimicState,
    ISimpleAction,
} from '../../types'

import {questions} from '../../mockdata/mimic'

let initialState: IMimicState = {
    question_index: 0,
    section_index: 0,
    stateByAttribute: {},
}

questions[initialState.question_index].sections[initialState.section_index].mapping_items.forEach((item: any) => {
    initialState.stateByAttribute[item.fhir_attribute] = {
        type: item.type,
        mot_clef: '',
    }
})

const reducer = (state = initialState, action: ISimpleAction): any => {
    switch (action.type) {
        case 'ADD_INPUT_COLUMN_MIMIC': {
            return {
                ...state,
                stateByAttribute: {
                    ...state.stateByAttribute,
                    [action.payload.fhirAttribute]: {
                        ...state.stateByAttribute[action.payload.fhirAttribute],
                        input_columns: state.stateByAttribute[action.payload.fhirAttribute].input_columns ?
                            [
                                ...state.stateByAttribute[action.payload.fhirAttribute].input_columns,
                                action.payload.inputColumn
                            ] :
                            [action.payload.inputColumn]
                    },
                },
            }
        }

        case 'UPDATE_TYPE_MIMIC': {
            return {
                ...state,
                stateByAttribute: {
                    ...state.stateByAttribute,
                    [action.payload.fhirAttribute]: {
                        ...state.stateByAttribute[action.payload.fhirAttribute],
                        type: action.payload.type,
                    }
                }
            }
        }

        case 'UPDATE_MOT_CLEF_MIMIC': {
            return {
                ...state,
                stateByAttribute: {
                    ...state.stateByAttribute,
                    [action.payload.fhirAttribute]: {
                        ...state.stateByAttribute[action.payload.fhirAttribute],
                        mot_clef: action.payload.mot_clef,
                    }
                }
            }
        }

        default:
            return state
    }
}

export default reducer
