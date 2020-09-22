import React, { useCallback, useEffect, useState } from 'react';
import { useMutation } from 'react-apollo';
import { useSelector, useDispatch } from 'react-redux';
import { Route } from 'react-router';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import { Spinner } from '@blueprintjs/core';
import queryString from 'query-string';
import { loader } from 'graphql.macro';
import jwt_decode from 'jwt-decode';

import { fetchTokens, getAccessToken, removeTokens } from 'oauth/tokenManager';
import { onError } from 'services/apollo';
import { login as loginAction } from 'services/user/actions';
import { IReduxStore } from 'types';
import {
  STATE_STORAGE_KEY,
  ACCESS_TOKEN_STORAGE_KEY,
  ID_TOKEN_STORAGE_KEY
} from '../../../constants';

const mUpsertUser = loader('src/graphql/mutations/upsertUser.graphql');

const PrivateRoute = ({ component: Component, ...rest }: any) => {
  const dispatch = useDispatch();

  const toaster = useSelector((state: IReduxStore) => state.toaster);
  const user = useSelector((state: IReduxStore) => state.user);

  const onUpsertCompleted = (data: any) => {
    // Put the user info in redux
    dispatch(loginAction(data.upsertUser));
  };

  const [upsertUser] = useMutation(mUpsertUser, {
    onCompleted: onUpsertCompleted,
    onError: onError(toaster)
  });

  const [token, setToken] = useState(getAccessToken());
  const params = queryString.parse(window.location.search);

  const storedState = localStorage.getItem(STATE_STORAGE_KEY);
  const stateMatch =
    'code' in params && 'state' in params && params.state === storedState;

  const setLoggedInUser = useCallback(async () => {
    await fetchTokens();
    const accessToken = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
    const idToken = localStorage.getItem(ID_TOKEN_STORAGE_KEY);
    setToken(accessToken);

    // Set axios interceptor
    // TODO put all that's below somewhere else?
    axios.interceptors.request.use(config => {
      config.headers.Authorization = `Bearer ${accessToken}`;
      return config;
    });

    // Get user info
    const decodedIdToken: any = jwt_decode(idToken!);

    // Upsert user from IdP into Pyrog DB
    upsertUser({
      variables: {
        userEmail: decodedIdToken.email,
        name: decodedIdToken.name
      }
    });
  }, [upsertUser]);

  useEffect(() => {
    if (stateMatch) {
      setLoggedInUser();
      localStorage.removeItem(STATE_STORAGE_KEY);
    }
  }, [stateMatch, setLoggedInUser]);

  // Redirect to the login page
  if (!('code' in params) && (!token || !user.id)) {
    if (token) removeTokens();
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

  if (!token) {
    return <Spinner />;
  }

  return <Route {...rest} render={props => <Component {...props} />} />;
};

export default PrivateRoute;
