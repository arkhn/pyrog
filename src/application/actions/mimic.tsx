import {action} from '../types'

import {availableTypes} from '../mockdata/mimic'

export const fetchRecommendedColumns = (fhir_attribute: string, type: string) : action => {
    return (dispatch: any, getState: any) => {
        const url = 'https://engine.arkhn.org/search/' + availableTypes[type]

        return fetch(url)
            .then((response: any) => {
                return response.json()
            }).then((response: any) => {
                dispatch(fetchRecommendedColumnsSuccess(fhir_attribute, response))
            }).catch((err: any) => {
                console.log(err)
                dispatch(fetchRecommendedColumnsFailure(err))
            })
    }
}

export const fetchBetaRecommendedColumns = (fhir_attribute: string, type: string, head_table: string, mot_clef: string) : action => {
    return (dispatch: any, getState: any) => {
        const url = mot_clef == '' || !mot_clef ? `https://engine.arkhn.org/beta/search/${availableTypes[type]}/${head_table}` : `https://engine.arkhn.org/beta/search/${type ? availableTypes[type] : 'all'}/${head_table}/${mot_clef}`

        return fetch(url)
            .then((response: any) => {
                return response.json()
            }).then((response: any) => {
                dispatch(fetchRecommendedColumnsSuccess(fhir_attribute, response))
            }).catch((err: any) => {
                console.log(err)
                dispatch(fetchRecommendedColumnsFailure(err))
            })
    }
}

export const fetchRecommendedColumnsSuccess = (fhir_attribute: string, columns: any): action => {
    return {
        type: 'FETCH_RECOMMENDED_COLUMNS_SUCCESS',
        payload: {
            fhir_attribute,
            columns,
        },
    }
}

export const fetchRecommendedColumnsFailure = (error: any): action => {
    return {
        type: 'FETCH_RECOMMENDED_COLUMNS_FAILURE',
        payload: error,
    }
}

export const addInputColumn = (fhir_attribute: string, input_column: string) => {
    return {
        type: 'ADD_INPUT_COLUMN_MIMIC',
        payload: {
            fhir_attribute,
            input_column,
        },
    }
}

export const changeTypeMimic = (fhir_attribute: string, type: string, head_table: string, mot_clef: string) : action => {
    return (dispatch: any, getState: any) => {
        Promise.all([
            dispatch(fetchBetaRecommendedColumns(fhir_attribute, type, head_table, mot_clef)),
        ]).then((response: any) => {
            dispatch(updateTypeMimic(fhir_attribute, type))
        })
    }
}

export const updateTypeMimic = (fhir_attribute: string, type: string) : action => {
    return {
        type: 'UPDATE_TYPE_MIMIC',
        payload: {
            fhir_attribute,
            type,
        },
    }
}

export const changeMotClefMimic = (fhir_attribute: string, type: string, head_table: string, mot_clef: string) : action => {
    return (dispatch: any, getState: any) => {
        Promise.all([
            dispatch(fetchBetaRecommendedColumns(fhir_attribute, type, head_table, mot_clef)),
        ]).then((response: any) => {
            dispatch(updateMotClefMimic(fhir_attribute, mot_clef))
        })
    }
}

export const updateMotClefMimic = (fhir_attribute: string, mot_clef: string) : action => {
    return {
        type: 'UPDATE_MOT_CLEF_MIMIC',
        payload: {
            fhir_attribute,
            mot_clef,
        },
    }
}
