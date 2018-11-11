import {
    action,
    IDatabaseSchema,
} from '../types'
import {
    fetchMapping,
} from './mapping'

export const changeCurrentDatabase = (database: string): action => {
    return (dispatch: any, getState: any) => {
        const databaseFilename = getState().nameLists.databaseNames[database].name

        Promise.all([
            dispatch(fetchDatabaseSchema('https://api.live.arkhn.org', databaseFilename)),
        ])
        .then(() => {
            dispatch(updateStateCurrentDatabase(database))
            dispatch(fetchMapping())
        })
    }
}

export const fetchDatabaseSchema = (url: string, databaseFilename: string) : action => {
    return (dispatch: any, getState: any) => {
        return fetch(`${url}/schema/${databaseFilename}/json`)
            .then((response: any) => {
                return response.json()
            }).then((response: any) => {
                dispatch(fetchDatabaseSchemaSuccess(response))
            }).catch((err: any) => {
                console.log(err)
                dispatch(fetchDatabaseSchemaFailure(err))
            })
    }
}

export const fetchDatabaseSchemaSuccess = (schema: IDatabaseSchema) : action => {
    return {
        type: 'FETCH_DATABASE_SCHEMA_SUCCESS',
        payload: schema,
    }
}

export const fetchDatabaseSchemaFailure = (err: any) : action => {
    return {
        type: 'FETCH_DATABASE_SCHEMA_FAILURE',
    }
}

export const updateStateCurrentDatabase = (database: string): action => {
    return {
        type: 'UPDATE_STATE_CURRENT_DATABASE',
        payload: database,
    }
}
