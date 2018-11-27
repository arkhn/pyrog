import {
    IAction,
    IDatabaseSchema,
} from '../types'
import {
    fetchMapping,
} from './mapping'

export const changeCurrentDatabase = (database: string): IAction => {
    return (dispatch: any, getState: any) => {
        const databaseFilename = getState().nameLists.databaseNames[database].name

        dispatch(loadingDatabaseSchema())

        Promise.all([
            dispatch(fetchDatabaseSchema('https://api.live.arkhn.org', databaseFilename)),
        ])
        .then(() => {
            dispatch(updateStateCurrentDatabase(database))
            dispatch(fetchMapping())
        })
    }
}

export const fetchDatabaseSchema = (url: string, databaseFilename: string) : IAction => {
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

export const loadingDatabaseSchema = () : IAction => {
    return {
        type: 'LOADING_DATABASE_SCHEMA',
    }
}

export const fetchDatabaseSchemaSuccess = (schema: IDatabaseSchema) : IAction => {
    return {
        type: 'FETCH_DATABASE_SCHEMA_SUCCESS',
        payload: schema,
    }
}

export const fetchDatabaseSchemaFailure = (err: any) : IAction => {
    return {
        type: 'FETCH_DATABASE_SCHEMA_FAILURE',
    }
}

export const updateStateCurrentDatabase = (database: string): IAction => {
    return {
        type: 'UPDATE_STATE_CURRENT_DATABASE',
        payload: database,
    }
}
