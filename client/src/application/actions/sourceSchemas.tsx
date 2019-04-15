import { IAction } from '../types'

// These actions handle source schema fetching.
export const loadingSourceSchema = () : IAction => {
    return {
        type: 'LOADING_SOURCE_SCHEMA',
    }
}

export const fetchSourceSchema = (sourceName: string, callback: any) : IAction => {
    return (dispatch: any, getState: any) => {
        dispatch(loadingSourceSchema())

        return fetch(`${process.env.HTTP_BACKEND_URL}/schemas/${sourceName}.json`)
            .then((response: any) => {
                return response.json()
            }).then((response: any) => {
                dispatch(fetchSourceSchemaSuccess(sourceName, response))
                callback()
            }).catch((err: any) => {
                console.log(err)
                dispatch(fetchSourceSchemaFailure(err))
            })
    }
}

export const fetchSourceSchemaSuccess = (sourceName: string, schema: any) : IAction => {
    return {
        type: 'FETCH_SOURCE_SCHEMA_SUCCESS',
        payload: {
            sourceName,
            schema,
        },
    }
}

export const fetchSourceSchemaFailure = (err: any) : IAction => {
    return {
        type: 'FETCH_SOURCE_SCHEMA_FAILURE',
    }
}
