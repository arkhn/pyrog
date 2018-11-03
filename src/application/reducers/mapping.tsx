import {
    action,
    IReduxMapping
} from '../types'

const initialState: IReduxMapping = {
    loading: false,
    content: null,
}

export const mapping = (state = initialState, action: action): IReduxMapping => {
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

        case 'ADD_INPUT_COLUMN':
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
                                inputColumns: [
                                    ...state.content.fhirMapping[currentFhirAttributePath].inputColumns,
                                    newInputColumn
                                ]
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

        default:
            return state
    }
}