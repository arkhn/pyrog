import {combineReducers} from 'redux'

// Data fetching reducers
import databaseSchemas from './databaseSchemas'
import recommendedColumns from './recommendedColumns'
import selectedDatabaseReducer from './selectedDatabaseReducer'
import userReducer from './user'

// View reducers
import mappingExplorer from '../containers/views/mappingExplorer/reducer'
import mimic from '../containers/views/mimic/reducer'

// Data reducer (also called canonical state)
const dataReducer = combineReducers({
    databaseSchemas,
    recommendedColumns,
})

// View reducer
const viewReducer = combineReducers({
    mappingExplorer,
    mimic,
})

const mainReducer = combineReducers({
    selectedDatabase: selectedDatabaseReducer,
    data: dataReducer,
    views: viewReducer,
    user: userReducer,
})

export default mainReducer
