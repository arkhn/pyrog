import {
    IAction,
} from '../../types'

// DATA FETCHING
// All data fetching actions are meant to be shared between
// views; they should all be stored under `./src/application/actions`
// and expect to be caught by reducers located under `state.data`.
// It should be possible to give callback actions to these data-feching actions.
import {
    fetchFhirResourceJson,
} from '../../actions/fhirResources'

import {
    fetchDatabaseSchema,
} from '../../actions/databases'

// STATE UPDATES
export const changeDatabase = (databaseName: string): IAction => {
    return (dispatch: any, getState: any) => {
        dispatch(fetchDatabaseSchema('https://api.live.arkhn.org', databaseName, () => dispatch(updateDatabase(databaseName))))
    }
}

export const updateDatabase = (database: string): IAction => {
    return {
        type: 'UPDATE_DATABASE',
        payload: database,
    }
}

export const changeFhirResource = (resource: string): IAction => {
    return (dispatch: any, getState: any) => {
        dispatch(fetchFhirResourceJson('https://api.live.arkhn.org', resource, () => dispatch(updateFhirResource(resource))))
    }
}

export const updateFhirResource = (resource: string): IAction => {
    return {
        type: 'UPDATE_FHIR_RESOURCE',
        payload: resource,
    }
}

export const updateFhirAttribute = (attribute: string): IAction => {
    return {
        type: 'UPDATE_FHIR_ATTRIBUTE',
        payload: attribute,
    }
}
