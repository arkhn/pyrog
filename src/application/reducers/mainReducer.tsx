import {combineReducers} from 'redux'

// Data fetching reducers
import databases from './databases'
import recommendedColumns from './recommendedColumns'

// View reducers
import mappingExplorer from '../views/mappingExplorer/reducer'
import mimic from '../views/mimic/reducer'

// Data reducer (also called canonical state)
const dataReducer = combineReducers({
    databases,
    recommendedColumns,
})

// View reducer
const viewReducer = combineReducers({
    mappingExplorer,
    mimic,
})

const mainReducer = combineReducers({
    data: dataReducer,
    views: viewReducer,
})

export default mainReducer
