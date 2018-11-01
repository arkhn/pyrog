import {action} from '../types'
import {cw_patient_mapping} from '../mockdata/mappings'

export const fetchMapping = (): any => {
    return (dispatch: any, getState: any) => {
        const state = getState()
        if (state.currentDatabase && state.currentFhirResource) {
            dispatch(loadingMapping())

            // Either load and dispatch mock data
            // or implement true fetching code
            if (state.appData.testState) {
                setTimeout(() => {
                    dispatch(fetchMappingSuccess(cw_patient_mapping))
                }, 500)
            } else {
                // TODO: parse url correctly
                let url = state.distantServerUrl + state.currentDatabase.name + state.currentFhirResource.name

                fetch(url)
                .then((response: any) => {
                    dispatch(fetchMappingSuccess(response.json()))
                }).catch( (err: any) => {
                    console.log(err)
                    dispatch(fetchMappingFailure(err))
                })
            }
        }
    }
}

export const loadingMapping = (): action => {
    return {
        type: 'LOADING_MAPPING',
    }
}

export const fetchMappingSuccess = (mapping: any): action => {
    return {
        type: 'FETCH_MAPPING_SUCCESS',
        value: mapping,
    }
}

export const fetchMappingFailure = (error: any): action => {
    return {
        type: 'FETCH_MAPPING_FAILURE',
        value: error,
    }
}
