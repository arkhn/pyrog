import {
    ISimpleAction,
} from '../types'

const initialState: any = {
    databaseNames: [],
    loadingDatabaseNames: false,
    loadingDatabaseSchema: false,
    schemaByDatabaseName: {},
}

const databases = (state = initialState, action: ISimpleAction): any => {
    switch (action.type) {
        // Cases handling database names fetching
        case 'LOADING_DATABASE_NAMES':
            return {
                ...state,
                loadingDatabaseNames: true,
            }

        case 'FETCH_DATABASE_NAMES_SUCCESS':
            return {
                ...state,
                databaseNames: action.payload,
                loadingDatabaseNames: false,
            }

        case 'FETCH_DATABASE_NAMES_FAILURE':
            return {
                ...state,
                loadingDatabaseNames: false,
            }

        // Cases handling fhir resource json fetching
        case 'LOADING_DATABASE_SCHEMA':
            return {
                ...state,
                loadingDatabaseSchema: true,
            }

        case 'FETCH_DATABASE_SCHEMA_SUCCESS':
            return {
                ...state,
                schemaByDatabaseName: {
                    ...state.schemaByDatabaseName,
                    [action.payload.databaseName]: {
                        ...action.payload.schema,
                    }
                },
                loadingDatabaseSchema: false,
            }

        case 'FETCH_DATABASE_SCHEMA_FAILURE':
            return {
                ...state,
                loadingDatabaseSchema: false,
            }

        default:
            return state
    }
}

export default databases
