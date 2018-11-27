import {
    ISimpleAction,
    IInputColumn,
    IReduxMapping,
} from '../types'

const initialState: IReduxMapping = {
    loading: false,
    content: null,
}

export const mapping = (state = initialState, action: ISimpleAction): IReduxMapping => {
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
                content: action.payload,
            }

        case 'FETCH_MAPPING_FAILURE':
            return {
                ...state,
                loading: false,
            }

        case 'ADD_INPUT_COLUMN': {
            const newInputColumn = {
                owner: action.payload.column.owner,
                table: action.payload.column.table,
                column: action.payload.column.column,
            }

            const currentFhirAttributePath = action.payload.currentFhirAttribute.join('.')

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
            const currentFhirAttributePath = action.payload.currentFhirAttribute.join('.')

            const modifiedInputColumns = state.content.fhirMapping[currentFhirAttributePath].inputColumns
            modifiedInputColumns.splice(action.payload.columnIndex, 1)

            return changeInputColumns(state, currentFhirAttributePath, modifiedInputColumns)
        } break;

        case 'UPDATE_PK_OWNER':
            return {
                ...state,
                content: {
                    ...state.content,
                    primaryKeyColumn: {
                        ...state.content.primaryKeyColumn,
                        owner: action.payload,
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
                        table: action.payload,
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
                        column: action.payload,
                    },
                },
            }

        case 'DELETE_JOIN': {
            const currentFhirAttributePath = action.payload.currentFhirAttribute.join('.')
            let modifiedInputColumns = state.content.fhirMapping[currentFhirAttributePath].inputColumns
            delete modifiedInputColumns[action.payload.columnIndex]['join']

            return changeInputColumns(state, currentFhirAttributePath, modifiedInputColumns)
        }

        case 'ADD_JOIN': {
            const currentFhirAttributePath = action.payload.currentFhirAttribute.join('.')
            let modifiedInputColumns = state.content.fhirMapping[currentFhirAttributePath].inputColumns

            modifiedInputColumns[action.payload.columnIndex]['join'] = {
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
            const currentFhirAttributePath = action.payload.currentFhirAttribute.join('.')
            let modifiedInputColumns = state.content.fhirMapping[currentFhirAttributePath].inputColumns
            modifiedInputColumns[action.payload.columnIndex].join.sourceColumn = action.payload.item

            return changeInputColumns(state, currentFhirAttributePath, modifiedInputColumns)
        }

        case 'UPDATE_JOIN_TARGET_COLUMN_OWNER': {
            const currentFhirAttributePath = action.payload.currentFhirAttribute.join('.')
            let modifiedInputColumns = state.content.fhirMapping[currentFhirAttributePath].inputColumns
            let change = (action.payload.item != modifiedInputColumns[action.payload.columnIndex].join.targetColumn.owner)
            modifiedInputColumns[action.payload.columnIndex].join.targetColumn = {
                owner: action.payload.item,
                table: change ? null : modifiedInputColumns[action.payload.columnIndex].join.targetColumn.table,
                column: change ? null : modifiedInputColumns[action.payload.columnIndex].join.targetColumn.column,
            }

            return changeInputColumns(state, currentFhirAttributePath, modifiedInputColumns)
        }

        case 'UPDATE_JOIN_TARGET_COLUMN_TABLE': {
            const currentFhirAttributePath = action.payload.currentFhirAttribute.join('.')
            let modifiedInputColumns = state.content.fhirMapping[currentFhirAttributePath].inputColumns
            let change = (action.payload.item != modifiedInputColumns[action.payload.columnIndex].join.targetColumn.table)
            modifiedInputColumns[action.payload.columnIndex].join.targetColumn = {
                ...modifiedInputColumns[action.payload.columnIndex].join.targetColumn,
                table: action.payload.item,
                column: change ? null : modifiedInputColumns[action.payload.columnIndex].join.targetColumn.column,
            }

            return changeInputColumns(state, currentFhirAttributePath, modifiedInputColumns)
        }

        case 'UPDATE_JOIN_TARGET_COLUMN_COLUMN': {
            const currentFhirAttributePath = action.payload.currentFhirAttribute.join('.')
            let modifiedInputColumns = state.content.fhirMapping[currentFhirAttributePath].inputColumns
            modifiedInputColumns[action.payload.columnIndex].join.targetColumn = {
                ...modifiedInputColumns[action.payload.columnIndex].join.targetColumn,
                column: action.payload.item,
            }

            return changeInputColumns(state, currentFhirAttributePath, modifiedInputColumns)
        }

        case 'UPDATE_INPUT_COLUMN_SCRIPT': {
            const currentFhirAttributePath = action.payload.currentFhirAttribute.join('.')
            let modifiedInputColumns = state.content.fhirMapping[currentFhirAttributePath].inputColumns
            modifiedInputColumns[action.payload.columnIndex].script = action.payload.item

            return changeInputColumns(state, currentFhirAttributePath, modifiedInputColumns)
        }

        case 'UPDATE_MERGING_SCRIPT': {
            const currentFhirAttributePath = action.payload.currentFhirAttribute.join('.')

            return {
                ...state,
                content: {
                    ...state.content,
                    fhirMapping : Object.assign(
                        {},
                        state.content.fhirMapping,
                        {[currentFhirAttributePath]: {
                            ...state.content.fhirMapping[currentFhirAttributePath],
                            mergingScript: action.payload.item,
                        }}
                    ),
                }
            }
        }

        default:
            return state
    }
}
