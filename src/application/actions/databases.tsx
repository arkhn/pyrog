import { IAction } from '../types'
import { INFO_URL } from '../app'

// The following actions query a rest api so as to fetch
// a string[] indicating database schemas available on the server side.
export const loadingDatabaseNames = () : IAction => {
    return {
        type: 'LOADING_DATABASE_NAMES',
    }
}

export const fetchDatabaseNames = () : IAction => {
    return (dispatch: any, getState: any) => {
        dispatch(loadingDatabaseNames())

        return fetch(`${INFO_URL}/schemas`)
            .then((response: any) => {
                return response.json()
            }).then((response: any) => {
                dispatch(fetchDatabaseNamesSuccess(response))
            }).catch((err: any) => {
                console.log(err)
                dispatch(fetchDatabaseNamesFailure(err))
            })
    }
}

export const fetchDatabaseNamesSuccess = (databaseNameList: string[]): IAction => {
    return {
        type: 'FETCH_DATABASE_NAMES_SUCCESS',
        payload: databaseNameList,
    }
}

export const fetchDatabaseNamesFailure = (error: any): IAction => {
    return {
        type: 'FETCH_DATABASE_NAMES_FAILURE',
        payload: error,
    }
}

// These actions handle database schema fetching.
export const loadingDatabaseSchema = () : IAction => {
    return {
        type: 'LOADING_DATABASE_SCHEMA',
    }
}

export const fetchDatabaseSchema = (databaseName: string, callback: any) : IAction => {
    return (dispatch: any, getState: any) => {
        dispatch(loadingDatabaseSchema())

        const databaseFilename = getState().data.databases.databaseNames[databaseName].name

        return fetch(`${INFO_URL}/schema/${databaseFilename}/json`)
            .then((response: any) => {
                return response.json()
            }).then((response: any) => {
                dispatch(fetchDatabaseSchemaSuccess(databaseName, response))
                callback()
            }).catch((err: any) => {
                console.log(err)
                dispatch(fetchDatabaseSchemaFailure(err))
            })
    }
}

export const fetchDatabaseSchemaSuccess = (databaseName: string, schema: any) : IAction => {
    return {
        type: 'FETCH_DATABASE_SCHEMA_SUCCESS',
        payload: {
            databaseName,
            schema,
        },
    }
}

export const fetchDatabaseSchemaFailure = (err: any) : IAction => {
    return {
        type: 'FETCH_DATABASE_SCHEMA_FAILURE',
    }
}
