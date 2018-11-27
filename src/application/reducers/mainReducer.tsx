import {combineReducers} from 'redux'

import {appData} from './appData'
import {currentDatabase} from './currentDatabase'
import {currentFhirAttribute} from './currentFhirAttribute'
import {currentFhirResource} from './currentFhirResource'
import {mapping} from './mapping'
import {nameLists} from './nameLists'
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

// const mainReducer = combineReducers({
//     currentDatabase,
//     currentFhirResource,
//     currentFhirAttribute,
//     mapping,
//     appData,
//     nameLists,
//     mimic,
// })

export default mainReducer
