import { HttpLink, InMemoryCache, ApolloClient } from "apollo-client-preset";
import { ApolloLink, split } from "apollo-link";
import { onError } from "apollo-link-error";
import { getMainDefinition } from "apollo-utilities";
import { WebSocketLink } from "apollo-link-ws";
import fetch from "unfetch";

const httpLink = new HttpLink({
  uri: process.env.HTTP_BACKEND_URL,
  fetch: fetch
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
  if (graphQLErrors) {
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  }

  if (networkError) {
    console.log(`[Network error]: ${networkError}`);
  }
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

const client = new ApolloClient({
  cache: new InMemoryCache(),
  connectToDevTools: true,
  link: ApolloLink.from(
    process.env.NODE_ENV === "development" ? [errorLink, link] : [link]
  )
});

export default client;
