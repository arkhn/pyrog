import {
    simpleAction,
    IReduxNameLists,
} from '../types'

const initialState: IReduxNameLists = {
    loadingNameLists: false,
    databaseNames: {},
    fhirResourceNameList: [],
}

export const nameLists = (state = initialState, action: simpleAction): IReduxNameLists => {
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

        case 'FETCH_FHIR_RESOURCE_NAME_LIST_SUCCESS':
            return {
                ...state,
                fhirResourceNameList: action.payload,
            }

        default:
            return state
    }
}
