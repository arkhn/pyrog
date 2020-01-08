import * as React from "react";
import { Route } from "react-router";
import { useQuery } from "@apollo/react-hooks";
import { Redirect } from "react-router-dom";
import { Spinner } from "@blueprintjs/core";

// Graphql
const meQuery = require("../../graphql/queries/me.graphql");

const PrivateRoute = ({ component: Component, ...rest }: any) => {
  const { data, loading, error } = useQuery(meQuery, {
    fetchPolicy: "network-only"
  });

  if (loading) {
    return <Route component={Spinner} />;
  }

  if (error) {
    return (
      <Route
        render={props => (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location }
            }}
          />
        )}
      />
    );
  }
  return <Route {...rest} render={props => <Component {...props} />} />;
};

export default PrivateRoute;
