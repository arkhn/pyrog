import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {createStore, applyMiddleware} from 'redux'
import {createLogger} from 'redux-logger'

import { HttpLink, InMemoryCache, ApolloClient } from 'apollo-client-preset'
import { ApolloLink, split } from 'apollo-link'
import { onError } from 'apollo-link-error'
import { getMainDefinition } from 'apollo-utilities'
import { WebSocketLink } from 'apollo-link-ws'
import { ApolloProvider } from 'react-apollo'

import './style.less'
import Routes from './routes'
import middlewares from './middlewares/middlewares'
import mainReducer from './reducers/mainReducer'
import {
    AUTH_TOKEN,
    GRAPHQL_WS_URL,
    GRAPHQL_HTTP_URL,
} from './constants'

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

const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
        graphQLErrors.map(({ message, locations, path }) =>
        console.log(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
        ),
    )

    if (networkError) console.log(`[Network error]: ${networkError}`)
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
    cache: new InMemoryCache(),
    connectToDevTools: true,
    link: ApolloLink.from(process.env.NODE_ENV === 'development' ?
        [errorLink, link] :
        [link]
    ),
})

const token = localStorage.getItem(AUTH_TOKEN)

// Render React app in DOM
// TODO: fix bad type cast
ReactDOM.render(
    <Provider store={store}>
        <ApolloProvider client={client as any}>
            <Routes />
        </ApolloProvider>
    </Provider>,
    document.getElementById('application-wrapper')
)
