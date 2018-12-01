import { IAction } from '../../types'

import {
    fetchBetaRecommendedColumns,
    fetchRecommendedColumns,
} from '../../actions/recommendedColumns'

export const addInputColumn = (fhirAttribute: string, inputColumn: string) => {
    return {
        type: 'ADD_INPUT_COLUMN_MIMIC',
        payload: {
            fhirAttribute,
            inputColumn,
        },
    }
}

export const changeTypeMimic = (fhirAttribute: string, type: string, head_table: string, mot_clef: string) : IAction => {
    return (dispatch: any, getState: any) => {
        Promise.all([
            dispatch(fetchBetaRecommendedColumns(fhirAttribute, type, head_table, mot_clef)),
        ]).then((response: any) => {
            dispatch(updateTypeMimic(fhirAttribute, type))
        })
    }
}

export const updateTypeMimic = (fhirAttribute: string, type: string) : IAction => {
    return {
        type: 'UPDATE_TYPE_MIMIC',
        payload: {
            fhirAttribute,
            type,
        },
    }
}

export const changeMotClefMimic = (fhirAttribute: string, type: string, head_table: string, mot_clef: string) : IAction => {
    return (dispatch: any, getState: any) => {
        Promise.all([
            dispatch(fetchBetaRecommendedColumns(fhirAttribute, type, head_table, mot_clef)),
        ]).then((response: any) => {
            dispatch(updateMotClefMimic(fhirAttribute, mot_clef))
        })
    }
}

export const updateMotClefMimic = (fhirAttribute: string, mot_clef: string) : IAction => {
    return {
        type: 'UPDATE_MOT_CLEF_MIMIC',
        payload: {
            fhirAttribute,
            mot_clef,
        },
    }
}
