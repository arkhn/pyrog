import {combineReducers} from 'redux'

// Data fetching reducers
import databaseSchemas from './databaseSchemas'
import recommendedColumns from './recommendedColumns'
import selectedDatabaseReducer from './selectedDatabase'
import toasterReducer from './toaster'
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
    data: dataReducer,
    selectedDatabase: selectedDatabaseReducer,
    toaster: toasterReducer,
    views: viewReducer,
    user: userReducer,
})

export default mainReducer
