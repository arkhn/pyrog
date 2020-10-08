import React, { useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Route } from 'react-router';
import { Redirect } from 'react-router-dom';
import { Spinner } from '@blueprintjs/core';
import queryString from 'query-string';
import { loader } from 'graphql.macro';
import { useApolloClient } from '@apollo/react-hooks';

import { fetchTokens, removeTokens } from 'oauth/tokenManager';
import { login as loginAction } from 'services/user/actions';
import { IReduxStore } from 'types';
import {
  ACCESS_TOKEN_STORAGE_KEY,
  STATE_STORAGE_KEY
} from '../../../constants';

const meQuery = loader('src/graphql/queries/me.graphql');

const PrivateRoute = ({ component: Component, ...rest }: any) => {
  const dispatch = useDispatch();
  const user = useSelector((state: IReduxStore) => state.user);
  const client = useApolloClient();

  const params = queryString.parse(window.location.search);

  const accessToken = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
  const storedState = localStorage.getItem(STATE_STORAGE_KEY);
  const stateMatch =
    'code' in params && 'state' in params && params.state === storedState;

  const setLoggedInUser = useCallback(async () => {
    if (stateMatch) await fetchTokens();

    const {
      data: { me }
    } = await client.query({
      query: meQuery
    });

    dispatch(loginAction(me));
  }, [client, dispatch, stateMatch]);

  useEffect(() => {
    if (stateMatch) {
      setLoggedInUser();
      localStorage.removeItem(STATE_STORAGE_KEY);
    }
  }, [stateMatch, setLoggedInUser]);

  if (accessToken && !user.id) {
    setLoggedInUser();
  }

  if (!user.id && !accessToken) {
    if (stateMatch) {
      // Wait for the code to be exchanged for a token
      return <Spinner />;
    } else {
      // Redirect to the login page
      removeTokens();
      return (
        <Route
          render={props => (
            <Redirect
              to={{
                pathname: '/login',
                state: { from: props.location }
              }}
            />
          )}
        />
      );
    }
  }

  return <Route {...rest} render={props => <Component {...props} />} />;
};

export default PrivateRoute;
