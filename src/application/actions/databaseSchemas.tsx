import { IAction } from '../types'
import { INFO_URL } from '../app'

// These actions handle database schema fetching.
export const loadingDatabaseSchema = () : IAction => {
    return {
        type: 'LOADING_DATABASE_SCHEMA',
    }
}

export const fetchDatabaseSchema = (databaseName: string, callback: any) : IAction => {
    return (dispatch: any, getState: any) => {
        dispatch(loadingDatabaseSchema())

        return fetch(`${INFO_URL}/${databaseName}.json`)
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
