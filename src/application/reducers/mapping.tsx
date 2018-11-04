import {
    action,
    IInputColumn,
    IReduxMapping,
} from '../types'

const initialState: IReduxMapping = {
    loading: false,
    content: null,
}

export const mapping = (state = initialState, action: action): IReduxMapping => {
    const changeInputColumns = (state: IReduxMapping, currentFhirAttributePath: string, modifiedInputColumns: IInputColumn[]) => {
        return {
            ...state,
            content: {
                ...state.content,
                fhirMapping : Object.assign(
                    {},
                    state.content.fhirMapping,
                    {[currentFhirAttributePath]: {
                        ...state.content.fhirMapping[currentFhirAttributePath],
                        inputColumns: modifiedInputColumns,
                    }}
                ),
            }
        }
    }

    switch (action.type) {
        case 'LOADING_MAPPING':
            return {
                ...state,
                loading: true,
            }

        case 'FETCH_MAPPING_SUCCESS':
            return {
                loading: false,
                content: action.value,
            }

        case 'FETCH_MAPPING_FAILURE':
            return {
                ...state,
                loading: false,
            }

        case 'ADD_INPUT_COLUMN': {
            const newInputColumn = {
                owner: action.value.column.owner,
                table: action.value.column.table,
                column: action.value.column.column,
            }

            const currentFhirAttributePath = action.value.currentFhirAttribute.join('.')

            try {
                return {
                    ...state,
                    content: {
                        ...state.content,
                        fhirMapping : Object.assign(
                            {},
                            state.content.fhirMapping,
                            {[currentFhirAttributePath]: {
                                ...state.content.fhirMapping[currentFhirAttributePath],
                                inputColumns: state.content.fhirMapping[currentFhirAttributePath].inputColumns.concat(newInputColumn)
                            }}
                        ),
                    }
                }
            } catch {
                return {
                    ...state,
                    content: {
                        ...state.content,
                        fhirMapping: {
                            ...state.content.fhirMapping,
                            [currentFhirAttributePath]: {
                                mergingScript: null,
                                inputColumns: [
                                    newInputColumn
                                ]
                            }
                        }
                    }
                }
            }
        } break;

        case 'REMOVE_INPUT_COLUMN': {
            const currentFhirAttributePath = action.value.currentFhirAttribute.join('.')

            const modifiedInputColumns = state.content.fhirMapping[currentFhirAttributePath].inputColumns
            modifiedInputColumns.splice(action.value.columnIndex, 1)

            return changeInputColumns(state, currentFhirAttributePath, modifiedInputColumns)
        } break;

        case 'UPDATE_PK_OWNER':
            return {
                ...state,
                content: {
                    ...state.content,
                    primaryKeyColumn: {
                        ...state.content.primaryKeyColumn,
                        owner: action.value,
                    },
                },
            }

        case 'UPDATE_PK_TABLE':
            return {
                ...state,
                content: {
                    ...state.content,
                    primaryKeyColumn: {
                        ...state.content.primaryKeyColumn,
                        table: action.value,
                    },
                },
            }

        case 'UPDATE_PK_COLUMN':
            return {
                ...state,
                content: {
                    ...state.content,
                    primaryKeyColumn: {
                        ...state.content.primaryKeyColumn,
                        column: action.value,
                    },
                },
            }

        case 'DELETE_JOIN': {
            const currentFhirAttributePath = action.value.currentFhirAttribute.join('.')
            let modifiedInputColumns = state.content.fhirMapping[currentFhirAttributePath].inputColumns
            delete modifiedInputColumns[action.value.columnIndex]['join']

            return changeInputColumns(state, currentFhirAttributePath, modifiedInputColumns)
        }

        case 'ADD_JOIN': {
            const currentFhirAttributePath = action.value.currentFhirAttribute.join('.')
            let modifiedInputColumns = state.content.fhirMapping[currentFhirAttributePath].inputColumns

            modifiedInputColumns[action.value.columnIndex]['join'] = {
                sourceColumn: null,
                targetColumn: {
                    owner: null,
                    table: null,
                    column: null,
                },
            }

            return changeInputColumns(state, currentFhirAttributePath, modifiedInputColumns)
        }

        case 'UPDATE_JOIN_SOURCE_COLUMN': {
            const currentFhirAttributePath = action.value.currentFhirAttribute.join('.')
            let modifiedInputColumns = state.content.fhirMapping[currentFhirAttributePath].inputColumns
            modifiedInputColumns[action.value.columnIndex].join.sourceColumn = action.value.item

            return changeInputColumns(state, currentFhirAttributePath, modifiedInputColumns)
        }

        case 'UPDATE_JOIN_TARGET_COLUMN_OWNER': {
            const currentFhirAttributePath = action.value.currentFhirAttribute.join('.')
            let modifiedInputColumns = state.content.fhirMapping[currentFhirAttributePath].inputColumns
            let change = (action.value.item != modifiedInputColumns[action.value.columnIndex].join.targetColumn.owner)
            modifiedInputColumns[action.value.columnIndex].join.targetColumn = {
                owner: action.value.item,
                table: change ? null : modifiedInputColumns[action.value.columnIndex].join.targetColumn.table,
                column: change ? null : modifiedInputColumns[action.value.columnIndex].join.targetColumn.column,
            }

            return changeInputColumns(state, currentFhirAttributePath, modifiedInputColumns)
        }

        case 'UPDATE_JOIN_TARGET_COLUMN_TABLE': {
            const currentFhirAttributePath = action.value.currentFhirAttribute.join('.')
            let modifiedInputColumns = state.content.fhirMapping[currentFhirAttributePath].inputColumns
            let change = (action.value.item != modifiedInputColumns[action.value.columnIndex].join.targetColumn.table)
            modifiedInputColumns[action.value.columnIndex].join.targetColumn = {
                ...modifiedInputColumns[action.value.columnIndex].join.targetColumn,
                table: action.value.item,
                column: change ? null : modifiedInputColumns[action.value.columnIndex].join.targetColumn.column,
            }

            return changeInputColumns(state, currentFhirAttributePath, modifiedInputColumns)
        }

        case 'UPDATE_JOIN_TARGET_COLUMN_COLUMN': {
            const currentFhirAttributePath = action.value.currentFhirAttribute.join('.')
            let modifiedInputColumns = state.content.fhirMapping[currentFhirAttributePath].inputColumns
            modifiedInputColumns[action.value.columnIndex].join.targetColumn = {
                ...modifiedInputColumns[action.value.columnIndex].join.targetColumn,
                column: action.value.item,
            }

            return changeInputColumns(state, currentFhirAttributePath, modifiedInputColumns)
        }

        case 'UPDATE_INPUT_COLUMN_SCRIPT': {
            const currentFhirAttributePath = action.value.currentFhirAttribute.join('.')
            let modifiedInputColumns = state.content.fhirMapping[currentFhirAttributePath].inputColumns
            modifiedInputColumns[action.value.columnIndex].script = action.value.item

            return changeInputColumns(state, currentFhirAttributePath, modifiedInputColumns)
        }

        case 'UPDATE_MERGING_SCRIPT': {
            const currentFhirAttributePath = action.value.currentFhirAttribute.join('.')

            return {
                ...state,
                content: {
                    ...state.content,
                    fhirMapping : Object.assign(
                        {},
                        state.content.fhirMapping,
                        {[currentFhirAttributePath]: {
                            ...state.content.fhirMapping[currentFhirAttributePath],
                            mergingScript: action.value.item,
                        }}
                    ),
                }
            }
        }

        default:
            return state
    }
}
