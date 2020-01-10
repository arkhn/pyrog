import * as React from 'react';
import { Provider } from 'react-redux';
import { combineReducers, createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import { PersistGate } from 'redux-persist/integration/react';
import { createLogger } from 'redux-logger';

import { HttpLink, InMemoryCache, ApolloClient } from 'apollo-client-preset';
import { ApolloLink } from 'apollo-link';
import { RestLink } from 'apollo-link-rest';
import { onError } from 'apollo-link-error';
import { ApolloProvider } from 'react-apollo';

import './style.scss';
import Routes from './routes';
import {
  AUTH_TOKEN,
  HTTP_BACKEND_URL,
  CLEANING_SCRIPTS_URI
} from './constants';

// Reducers

// Data fetching reducers
import sourceSchemas from './services/selectedNode/sourceSchemas/reducer';
import recommendedColumns from './services/recommendedColumns/reducer';
import selectedNodeReducer from './services/selectedNode/reducer';
import toasterReducer from './services/toaster/reducer';
import userReducer from './services/user/reducer';

// View reducers
import mimic from './components/mimic/reducer';

// REDUX

// Middlewares
const middlewares = [
  function thunkMiddleware({ dispatch, getState }: any) {
    return function(next: any) {
      return function(action: any) {
        return typeof action === 'function'
          ? action(dispatch, getState)
          : next(action);
      };
    };
  }
];
if (process.env.NODE_ENV === 'development') {
  // Log redux dispatch only in development
  middlewares.push(createLogger({}));
}

// Data reducer (also called canonical state)
const dataReducer = combineReducers({
  sourceSchemas,
  recommendedColumns
});

// View reducer
const viewReducer = combineReducers({
  mimic
});

const mainReducer = combineReducers({
  data: dataReducer,
  selectedNode: selectedNodeReducer,
  toaster: toasterReducer,
  views: viewReducer,
  user: userReducer
});

// Store
const persistConfig = {
  key: 'root',
  storage
};
const persistedReducer = persistReducer(persistConfig, mainReducer);

const finalCreateStore = applyMiddleware(...middlewares)(createStore);
const store = finalCreateStore(persistedReducer);

const persistor = persistStore(store);

// APOLLO

// HttpLink
console.log('----', process.env);
const httpLink = new HttpLink({
  uri: HTTP_BACKEND_URL,
  fetch: fetch
});

const middlewareLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem(AUTH_TOKEN);

  operation.setContext({
    headers: {
      Authorization: token ? `Bearer ${token}` : ''
    }
  });

  return forward(operation);
});

const httpLinkAuth = middlewareLink.concat(httpLink);

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );

  if (networkError) console.log(`[Network error]: ${networkError}`);
});

// Aggregate all links
const links = [];
if (process.env.NODE_ENV === 'development') {
  links.push(errorLink);
}
if (CLEANING_SCRIPTS_URI) {
  links.push(
    new RestLink({
      uri: CLEANING_SCRIPTS_URI + '/',
      headers: {
        'Content-Type': 'application/json'
      }
    })
  );
}
links.push(httpLinkAuth);

// Client
export const client = new ApolloClient({
  cache: new InMemoryCache(),
  connectToDevTools: true,
  link: ApolloLink.from(links)
});

export default () => (
  <Provider store={store}>
    <ApolloProvider client={client}>
      <PersistGate loading={null} persistor={persistor}>
        <Routes />
      </PersistGate>
    </ApolloProvider>
  </Provider>
);
