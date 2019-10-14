import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import { createLogger } from "redux-logger";

import { HttpLink, InMemoryCache, ApolloClient } from "apollo-client-preset";
import { ApolloLink, split } from "apollo-link";
import { onError } from "apollo-link-error";
import { getMainDefinition } from "apollo-utilities";
import { WebSocketLink } from "apollo-link-ws";
import { ApolloProvider } from "react-apollo";
import { ApolloProvider as ApolloHooksProvider } from "react-apollo-hooks";
import { combineReducers } from "redux";

import "./style.less";
import Routes from "./routes";

// REDUX

// Middlewares
const middlewares = [
  function thunkMiddleware({ dispatch, getState }: any) {
    return function(next: any) {
      return function(action: any) {
        return typeof action === "function"
          ? action(dispatch, getState)
          : next(action);
      };
    };
  }
];
if (process.env.NODE_ENV === "development") {
  // Log redux dispatch only in development
  middlewares.push(createLogger({}));
}

// Reducers

// Data fetching reducers
import sourceSchemas from "./services/selectedNode/sourceSchemas/reducer";
import recommendedColumns from "./services/recommendedColumns/reducer";
import selectedNodeReducer from "./services/selectedNode/reducer";
import toasterReducer from "./services/toaster/reducer";
import userReducer from "./services/user/reducer";

// View reducers
import mimic from "./views/mimic/reducer";

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
const finalCreateStore = applyMiddleware(...middlewares)(createStore);
const store = finalCreateStore(mainReducer);

// APOLLO

// HttpLink
const httpLink = new HttpLink({
  uri: process.env.HTTP_BACKEND_URL
});

const middlewareLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem(process.env.AUTH_TOKEN);

  operation.setContext({
    headers: {
      Authorization: token ? `Bearer ${token}` : ""
    }
  });

  return forward(operation);
});

const httpLinkAuth = middlewareLink.concat(httpLink);

// WebSocketLink
const wsLink = new WebSocketLink({
  uri: process.env.WS_BACKEND_URL,
  options: {
    reconnect: true,
    connectionParams: {
      Authorization: `Bearer ${localStorage.getItem(process.env.AUTH_TOKEN)}`
    }
  }
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );

  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const link = split(
  // Split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLinkAuth
);

// Client
export const client = new ApolloClient({
  cache: new InMemoryCache(),
  connectToDevTools: true,
  link: ApolloLink.from(
    process.env.NODE_ENV === "development" ? [errorLink, link] : [link]
  )
});

const token = localStorage.getItem(process.env.AUTH_TOKEN);

ReactDOM.render(
  <Provider store={store}>
    <ApolloProvider client={client}>
      <ApolloHooksProvider client={client}>
        <Routes />
      </ApolloHooksProvider>
    </ApolloProvider>
  </Provider>,
  document.getElementById("application-wrapper")
);
