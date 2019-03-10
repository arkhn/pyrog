import {
    IAction,
} from '../../types'

// DATA FETCHING
// All data fetching actions are meant to be shared between
// views; they should all be stored under `./src/application/actions`
// and expect to be caught by reducers located under `state.data`.
// It should be possible to give callback actions to these data-feching actions.
import {
    fetchDatabaseSchema,
} from '../../actions/databases'

// STATE UPDATES
export const changeDatabase = (databaseName: string): IAction => {
    return (dispatch: any, getState: any) => {
        dispatch(fetchDatabaseSchema(databaseName, () => dispatch(updateDatabase(databaseName))))
    }
}

export const updateDatabase = (database: string): IAction => {
    return {
        type: 'UPDATE_DATABASE',
        payload: database,
    }
}

export const updateFhirResource = (resourceName: string, resourceId: string): IAction => {
    return {
        type: 'UPDATE_FHIR_RESOURCE',
        payload: {
            resourceName,
            resourceId,
        }
    }
}

export const updateFhirAttribute = (attributePath: string[]): IAction => {
    return {
        type: 'UPDATE_FHIR_ATTRIBUTE',
        payload: attributePath,
    }
}
