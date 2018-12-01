import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {createStore, applyMiddleware} from 'redux'
import {createLogger} from 'redux-logger'

import { HttpLink, InMemoryCache, ApolloClient } from 'apollo-client-preset'
import { ApolloLink, split } from 'apollo-link'
import { WebSocketLink } from 'apollo-link-ws'
import { ApolloProvider } from 'react-apollo'

import './style.less'
import Routes from './routes'
import middlewares from './middlewares/middlewares'
import mainReducer from './reducers/mainReducer'

// Define API urls
export const ENGINE_URL = (process.env.NODE_ENV === 'development') ?
    'https://engine.arkhn.org' :
    'https://engine.arkhn.org'

export const INFO_URL = (process.env.NODE_ENV === 'development') ?
    'https://api.live.arkhn.org' :
    'https://api.live.arkhn.org'

export const GRAPHQL_URL = (process.env.NODE_ENV === 'development') ?
    'ws://localhost:4000' :
    'ws://localhost:4000'

// Redux initialisation
if (process.env.NODE_ENV === 'development') {
    // Log redux dispatch only in development
    middlewares.push(createLogger({}))
}
const finalCreateStore = applyMiddleware(...middlewares)(createStore)
const store = finalCreateStore(mainReducer)

// Apollo setup
const wsLink = new WebSocketLink({
    uri: GRAPHQL_URL,
    options: {
        reconnect: true,
    },
})

const client = new ApolloClient({
    link: wsLink,
    cache: new InMemoryCache(),
    connectToDevTools: true,
})

// Render React app in DOM
ReactDOM.render(
    <Provider store={store}>
        <ApolloProvider client={client}>
            <Routes />
        </ApolloProvider>
    </Provider>,
    document.getElementById('application-wrapper')
)
