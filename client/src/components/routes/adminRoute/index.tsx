import * as React from 'react';
import { Route } from 'react-router';
import useReactRouter from 'use-react-router';
import { useQuery } from '@apollo/react-hooks';
import { Spinner } from '@blueprintjs/core';
import { loader } from 'graphql.macro';

// Graphql
const meQuery = loader('src/graphql/queries/me.graphql');

const AdminRoute = ({ component: Component, ...rest }: any) => {
  const { history } = useReactRouter();
  const { data, loading, error } = useQuery(meQuery, {
    fetchPolicy: 'network-only'
  });

  if (loading || !(data || error)) {
    return <Route component={Spinner} />;
  }

  if (error || data.me.role !== 'ADMIN') {
    history.goBack();
    return null;
  }
  return <Route {...rest} render={props => <Component {...props} />} />;
};

export default AdminRoute;
