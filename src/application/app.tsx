import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {createStore, applyMiddleware} from 'redux'
import {createLogger} from 'redux-logger'

import { HttpLink, InMemoryCache, ApolloClient } from 'apollo-client-preset'
import { ApolloLink, split } from 'apollo-link'
import { getMainDefinition } from 'apollo-utilities'
import { WebSocketLink } from 'apollo-link-ws'
import { ApolloProvider } from 'react-apollo'

import './style.less'
import Routes from './routes'
import middlewares from './middlewares/middlewares'
import mainReducer from './reducers/mainReducer'
import { AUTH_TOKEN } from './constant'

// API urls
export const ENGINE_URL = (process.env.NODE_ENV === 'development') ?
    'https://engine.arkhn.org' :
    'https://engine.arkhn.org'

export const INFO_URL = (process.env.NODE_ENV === 'development') ?
    'https://api.live.arkhn.org' :
    'https://api.live.arkhn.org'

export const GRAPHQL_WS_URL = (process.env.NODE_ENV === 'development') ?
    'ws://localhost:4000' :
    'wss://graphql.live.arkhn.org'

export const GRAPHQL_HTTP_URL = (process.env.NODE_ENV === 'development') ?
    'http://localhost:4000' :
    'https://graphql.live.arkhn.org'

// Redux initialisation
if (process.env.NODE_ENV === 'development') {
    // Log redux dispatch only in development
    middlewares.push(createLogger({}))
}
const finalCreateStore = applyMiddleware(...middlewares)(createStore)
const store = finalCreateStore(mainReducer)

// APOLLO SETUP

// HttpLink
const httpLink = new HttpLink({
    uri: GRAPHQL_HTTP_URL,
})

const middlewareLink = new ApolloLink((operation, forward) => {
    const token = localStorage.getItem(AUTH_TOKEN)

    operation.setContext({
        headers: {
            Authorization: token ? `Bearer ${token}` : '',
        },
    })

    return forward(operation)
})

const httpLinkAuth = middlewareLink.concat(httpLink)

// WebSocketLink
const wsLink = new WebSocketLink({
    uri: GRAPHQL_WS_URL,
    options: {
        reconnect: true,
        connectionParams: {
            Authorization: `Bearer ${localStorage.getItem(AUTH_TOKEN)}`,
        }
    },
})

const link = split(
    // Split based on operation type
    ({ query }) => {
        const definition = getMainDefinition(query)
        return definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
    },
    wsLink,
    httpLinkAuth,
)

// Client
const client = new ApolloClient({
    // link: wsLink,
    link: ApolloLink.from([link]),
    cache: new InMemoryCache(),
    connectToDevTools: true,
})

const token = localStorage.getItem(AUTH_TOKEN)

// Render React app in DOM
ReactDOM.render(
    <Provider store={store}>
        <ApolloProvider client={client}>
            <Routes />
        </ApolloProvider>
    </Provider>,
    document.getElementById('application-wrapper')
)
