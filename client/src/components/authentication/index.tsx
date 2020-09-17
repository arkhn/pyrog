import { Button } from '@blueprintjs/core';
import React from 'react';
import { useDispatch } from 'react-redux';
import useReactRouter from 'use-react-router';
import { v4 as uuid } from 'uuid';

import Navbar from 'components/navbar';
import { authClient } from 'oauth/authClient';
import { login as loginAction } from 'services/user/actions';

// Import types
import { IReduxStore } from 'types';
import { STATE_STORAGE_KEY } from '../../constants';

import './style.scss';

const AuthenticationView = (): React.ReactElement => {
  const dispatch = useDispatch();
  const { history } = useReactRouter();

  const startAuthentication = () => {
    const state = uuid();
    localStorage.setItem(STATE_STORAGE_KEY, state);
    const uri = authClient.code.getUri({
      state: state
    });
    window.location.assign(uri);
  };

  const loginForm = (
    <div className="login-form">
      <h2>Se connecter</h2>
        <Button
          intent="primary"
          large
          type="submit"
          onClick={startAuthentication}
        >
          Se connecter avec Arkhn
        </Button>
    </div>
  );

  return (
    <div>
      <Navbar />
      <div className="formulaires">{loginForm}</div>
    </div>
  );
};

export default AuthenticationView;
