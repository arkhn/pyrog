import {
    ISimpleAction,
    IReduxNameLists,
} from '../types'

const initialState: IReduxNameLists = {
    loadingNameLists: false,
    databaseNames: {},
    fhirResources: {},
    fhirDatatypes: {},
}

export const nameLists = (state = initialState, action: ISimpleAction): IReduxNameLists => {
    switch (action.type) {
        case 'LOADING_NAME_LISTS':
            return {
                ...state,
                loadingNameLists: true,
            }

        case 'FETCH_INFO_NAME_LIST_SUCCESS':
            return {
                ...state,
                loadingNameLists: false,
            }

        case 'FETCH_INFO_NAME_LIST_FAILURE':
            return {
                ...state,
                loadingNameLists: false,
            }

        case 'FETCH_DATABASE_NAME_LIST_SUCCESS':
            return {
                ...state,
                databaseNames: action.payload,
            }

        case 'FETCH_FHIR_RESOURCES_SUCCESS':
            return {
                ...state,
                fhirResources: action.payload,
            }

        case 'FETCH_FHIR_DATATYPES_SUCCESS':
            return {
                ...state,
                fhirDatatypes: action.payload,
            }

        default:
            return state
    }
}
