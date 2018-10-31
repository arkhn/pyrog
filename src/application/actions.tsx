import {
    action,
} from './types'

import config from './config'
const serverUrl = config('app').serverURL

export function changeCurrentDatabase(database: string): any {
    return {
        type: 'CHANGE_CURRENT_DATABASE',
        value: database,
    }
}

export function updateStateCurrentDatabase(database: string): action {
    return {
        type: 'UPDATE_STATE_CURRENT_DATABASE',
        value: database,
    }
}

export function changeCurrentFhirResource(resource: string): action {
    return {
        type: 'CHANGE_CURRENT_FHIR_RESOURCE',
        value: resource,
    }
}

export function updateStateCurrentFhirResource(resource: string): action {
    return {
        type: 'UPDATE_STATE_CURRENT_FHIR_RESOURCE',
        value: resource,
    }
}

export function changeCurrentDBOwner(owner: string): action {
    return {
        type: 'CHANGE_CURRENT_DB_OWNER',
        value: owner,
    }
}

export function changeCurrentDBTable(table: string): action {
    return {
        type: 'CHANGE_CURRENT_DB_TABLE',
        value: table,
    }
}

export function changeCurrentDBPrimaryKey(pk: string): action {
    return {
        type: 'CHANGE_CURRENT_DB_PK',
        value: pk,
    }
}

export function changeCurrentTreeNode(originallySelected: boolean, nodePath: string[]): action {
    return {
        type: 'CHANGE_CURRENT_TREE_NODE',
        value: {
            originallySelected,
            nodePath,
        },
    }
}
