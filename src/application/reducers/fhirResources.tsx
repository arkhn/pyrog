import {
    ISimpleAction,
} from '../types'

const initialState: any = {
    jsonByResourceName: null,
    loadingResourceNames: false,
    loadingResourceJson: false,
    resourceNames: [],
}

const fhirResources = (state = initialState, action: ISimpleAction): any => {
    switch (action.type) {
        // Cases handling fhir resource names fetching
        case 'LOADING_FHIR_RESOURCE_NAMES':
            return {
                ...state,
                loadingResourceNames: true,
            }

        case 'FETCH_FHIR_RESOURCE_NAMES_SUCCESS':
            return {
                ...state,
                resourceNames: action.payload,
                loadingResourceNames: false,
            }

        case 'FETCH_FHIR_RESOURCE_NAMES_FAILURE':
            return {
                ...state,
                loadingResourceNames: false,
            }

        // Cases handling fhir resource json fetching
        case 'LOADING_FHIR_RESOURCE_JSON':
            return {
                ...state,
                loadingResourceJson: true,
            }

        case 'FETCH_FHIR_RESOURCE_JSON_SUCCESS':
            return {
                ...state,
                jsonByResourceName: {
                    ...state.jsonByResourceName,
                    [action.payload.resourceName]: {
                        ...action.payload.json,
                    }
                },
                loadingResourceJson: false,
            }

        case 'FETCH_FHIR_RESOURCE_JSON_FAILURE':
            return {
                ...state,
                loadingResourceJson: false,
            }

        default:
            return state
    }
}

export default fhirResources
