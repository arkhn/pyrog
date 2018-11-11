import {combineReducers} from 'redux'

import {appData} from './appData'
import {currentDatabase} from './currentDatabase'
import {currentFhirAttribute} from './currentFhirAttribute'
import {currentFhirResource} from './currentFhirResource'
import {mapping} from './mapping'
import {nameLists} from './nameLists'

const mainReducer = combineReducers({
    currentDatabase,
    currentFhirResource,
    currentFhirAttribute,
    mapping,
    appData,
    nameLists,
})

export default mainReducer
