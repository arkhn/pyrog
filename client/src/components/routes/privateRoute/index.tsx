import React, { useEffect, useState } from 'react';
import { useMutation } from 'react-apollo';
import { useSelector, useDispatch } from 'react-redux';
import { Route } from 'react-router';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import { Spinner } from '@blueprintjs/core';
import queryString from 'query-string';
import { loader } from 'graphql.macro';

import { fetchToken, getAccessToken, removeToken } from 'oauth/tokenManager';
import { onError } from 'services/apollo';
import { login as loginAction } from 'services/user/actions';
import { IReduxStore } from 'types';
import {
  STATE_STORAGE_KEY,
  TOKEN_STORAGE_KEY,
  USER_INFO_URL
} from '../../../constants';

const mUpsertUser = loader('src/graphql/mutations/upsertUser.graphql');

const PrivateRoute = ({ component: Component, ...rest }: any) => {
  // TODO if token becomes invalid, logout?
  const dispatch = useDispatch();

  const toaster = useSelector((state: IReduxStore) => state.toaster);

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
  const stateMismatch =
    'code' in params &&
    'state' in params &&
    !!storedState &&
    params.state !== storedState;

  // TODO clean that
  useEffect(() => {
    const getToken = async () => {
      const oauthToken = await fetchToken();
      setToken(oauthToken);

      // Set axios interceptor
      // TODO put all that's below somewhere else?
      axios.interceptors.request.use(config => {
        const token = localStorage.getItem(TOKEN_STORAGE_KEY);
        config.headers.Authorization = `Bearer ${token}`;
        return config;
      });

      // Get user info
      // TODO should we use the id token instead?
      const userInfoResp = await axios.get(USER_INFO_URL!);
      const userInfo = userInfoResp.data;

      // Upsert user from IdP into Pyrog DB
      upsertUser({
        variables: {
          userEmail: userInfo.email,
          name: userInfo.name
        }
      });
    };

    if ('code' in params && !!storedState && params.state === storedState) {
      getToken();
      localStorage.removeItem(STATE_STORAGE_KEY);
    }
  }, [token]);

  // Redirect to the login page
  if (!(token || 'code' in params) || stateMismatch) {
    if (token) removeToken();
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
