import {
    IAction,
} from '../../../types'

// DATA FETCHING
// All data fetching actions are meant to be shared between
// views; they should all be stored under `./src/application/actions`
// and expect to be caught by reducers located under `state.data`.
// It should be possible to give callback actions to these data-feching actions.
import {
    fetchDatabaseSchema,
} from '../../../actions/databases'

// STATE UPDATES
export const changeDatabase = (databaseId: string, databaseName: string): IAction => {
    return (dispatch: any, getState: any) => {
        dispatch(fetchDatabaseSchema(databaseName, () => dispatch(updateDatabase(databaseId, databaseName))))
    }
}

export const updateDatabase = (databaseId: string, databaseName: string): IAction => {
    return {
        type: 'UPDATE_DATABASE',
        payload: {
            databaseId,
            databaseName,
        },
    }
}

export const updateFhirResource = (resourceId: string, resourceName: string): IAction => {
    return {
        type: 'UPDATE_FHIR_RESOURCE',
        payload: {
            resourceName,
            resourceId,
        }
    }
}

export const updateFhirAttribute = (attributeId: string, attributeName: string): IAction => {
    return {
        type: 'UPDATE_FHIR_ATTRIBUTE',
        payload: {
            attributeId,
            attributeName,
        }
    }
}
