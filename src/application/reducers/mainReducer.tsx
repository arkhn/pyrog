import {combineReducers} from 'redux'

import {mimic} from './mimic'

// Data fetching reducers
import databases from './databases'
import fhirResources from './fhirResources'

// View reducers
import mappingExplorer from '../views/mappingExplorer/reducer'

// Data reducer (also called canonical state)
const dataReducer = combineReducers({
    databases,
    fhirResources,
})

// View reducer
const viewReducer = combineReducers({
    mappingExplorer,
})

const mainReducer = combineReducers({
    data: dataReducer,
    views: viewReducer,
})

export default mainReducer
