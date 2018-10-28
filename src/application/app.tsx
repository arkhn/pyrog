import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {createStore, applyMiddleware, combineReducers} from 'redux'
import {createLogger} from 'redux-logger'

import './../style.less'
import Routes from './routes'
import middlewares from './middlewares'
import * as viewReducers from './reducers'

const loggerMiddleware = createLogger({})

const reducer = viewReducers.reducer
const finalCreateStore = applyMiddleware(...middlewares, loggerMiddleware)(createStore)
const store = finalCreateStore(reducer)

ReactDOM.render(
    <Provider store={store}>
        <Routes />
    </Provider>,
    document.getElementById('application-wrapper')
);
