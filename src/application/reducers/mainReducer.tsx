import {combineReducers} from 'redux'

// Data fetching reducers
import databases from './databases'
import recommendedColumns from './recommendedColumns'
import userReducer from './user'

// View reducers
import mappingExplorer from '../containers/views/mappingExplorer/reducer'
import mimic from '../containers/views/mimic/reducer'

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
    user: userReducer,
})

export default mainReducer
