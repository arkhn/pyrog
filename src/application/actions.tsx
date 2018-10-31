import config from './config';
import {
    action,
    IFhirResource,
    IDatabase,
} from './types'

const serverUrl = config('app').serverURL

export function toggleDialogVisibility(): action{
    return {
        type: 'TOGGLE_DIALOG',
    }
}

export function changeCurrentInputDatabase(database: IDatabase): action {
    return {
        type: 'CHANGE_INPUT_DATABASE',
        value: database,
    }
}

export function changeCurrentFhirResource(resource: IFhirResource): action {
    return {
        type: 'CHANGE_FHIR_RESOURCE',
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
