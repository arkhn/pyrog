import { Button, FormGroup, Icon, InputGroup, Tag } from '@blueprintjs/core';
import React, { useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { useDispatch, useSelector } from 'react-redux';
import useReactRouter from 'use-react-router';
import { loader } from 'graphql.macro';

import Navbar from 'components/navbar';

import { login as loginAction } from 'services/user/actions';

// Import types
import { IReduxStore } from 'types';
import { AUTH_TOKEN } from '../../constants';

import './style.scss';

// Graphql
const mLogin = loader('../../graphql/mutations/login.graphql');
const mSignup = loader('../../graphql/mutations/signup.graphql');

interface Login {
  email: string;
  password: string;
}
interface Signup {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
}

const AuthenticationView = (): React.ReactElement => {
  const dispatch = useDispatch();
  const { history } = useReactRouter();

  const toaster = useSelector((state: IReduxStore) => state.toaster);

  const [login, setLogin] = useState({ email: '', password: '' } as Login);
  const [signup, setSignup] = useState({
    email: '',
    name: '',
    password: '',
    confirmPassword: ''
  } as Signup);

  const onCompletedSignup = (data: any): void => {
    if (data.signup.token) {
      const token = data.signup.token;
      const { id, name, email } = data.signup.user;
      localStorage.setItem(AUTH_TOKEN, token);
      dispatch(loginAction(id, name, email));
      history.push('/');
    }
  };

  const onErrorSignup = (error: any): void => {
    toaster.show({
      icon: 'error',
      intent: 'danger',
      message: error.message.replace('GraphQL error:', ''),
      timeout: 4000
    });
  };

  const [mutationSignup, { loading: loadingSignup }] = useMutation(mSignup, {
    onCompleted: onCompletedSignup,
    onError: onErrorSignup
  });
  const onCompletedLogin = (data: any) => {
    if (data.login.token) {
      const token = data.login.token;
      const { id, name, email } = data.login.user;
      localStorage.setItem(AUTH_TOKEN, token);
      dispatch(loginAction(id, name, email));
      history.push('/');
    }
  };

  const onErrorLogin = (error: any): void => {
    toaster.show({
      icon: 'error',
      intent: 'danger',
      message: error.message.replace('GraphQL error:', ''),
      timeout: 4000
    });
  };

  const [mutationLogin, { loading: loadingLogin }] = useMutation(mLogin, {
    onCompleted: onCompletedLogin,
    onError: onErrorLogin
  });

  const signupForm = (
    <div className="signup-form">
      <h2>S'inscrire</h2>
      <form
        onSubmit={(e: any) => {
          e.preventDefault();
          mutationSignup({
            variables: {
              email: signup.email,
              name: signup.name,
              password: signup.password
            }
          });
        }}
      >
        <FormGroup label="Adresse mail" labelFor="text-input">
          <InputGroup
            leftIcon="inbox"
            placeholder="Email"
            value={signup.email}
            onChange={(event: React.FormEvent<HTMLElement>) => {
              const target = event.target as HTMLInputElement;
              setSignup({ ...signup, email: target.value });
            }}
          />
        </FormGroup>
        <FormGroup label="Nom" labelFor="text-input">
          <InputGroup
            leftIcon="user"
            placeholder="Nom"
            value={signup.name}
            onChange={(event: React.FormEvent<HTMLElement>) => {
              const target = event.target as HTMLInputElement;
              setSignup({ ...signup, name: target.value });
            }}
          />
        </FormGroup>
        <FormGroup label="Mot de passe" labelFor="text-input">
          <InputGroup
            leftIcon="lock"
            placeholder="Mot de passe"
            type="password"
            value={signup.password}
            onChange={(event: React.FormEvent<HTMLElement>) => {
              const target = event.target as HTMLInputElement;
              setSignup({ ...signup, password: target.value });
            }}
          />
        </FormGroup>
        <FormGroup label="Confirmation du mot de passe" labelFor="text-input">
          <InputGroup
            leftIcon="lock"
            placeholder="Mot de passe"
            rightElement={
              signup.confirmPassword ? (
                signup.confirmPassword !== signup.password ? (
                  <Tag minimal={true}>
                    <Icon color={'#EB532D'} icon={'cross'} />
                  </Tag>
                ) : (
                  <Tag minimal={true}>
                    <Icon color={'#15B371'} icon={'tick'} />
                  </Tag>
                )
              ) : (
                <Tag className={'hidden'} minimal={true}>
                  <Icon icon={'tick'} />
                </Tag>
              )
            }
            type="password"
            value={signup.confirmPassword}
            onChange={(event: React.FormEvent<HTMLElement>) => {
              const target = event.target as HTMLInputElement;
              setSignup({ ...signup, confirmPassword: target.value });
            }}
          />
        </FormGroup>
        <FormGroup>
          <Button
            disabled={
              loadingSignup ||
              signup.password === '' ||
              signup.password !== signup.confirmPassword
            }
            intent="primary"
            large
            loading={loadingSignup}
            type={'submit'}
          >
            S'inscrire
          </Button>
        </FormGroup>
      </form>
    </div>
  );

  const loginForm = (
    <div className="login-form">
      <h2>Se connecter</h2>
      <form
        onSubmit={(e: any): void => {
          e.preventDefault();
          mutationLogin({
            variables: {
              email: login.email,
              password: login.password
            }
          });
        }}
      >
        <FormGroup label="Adresse mail" labelFor="text-input">
          <InputGroup
            leftIcon="user"
            placeholder="Email"
            value={login.email}
            onChange={(event: React.FormEvent<HTMLElement>): void => {
              const target = event.target as HTMLInputElement;
              setLogin({ ...login, email: target.value });
            }}
          />
        </FormGroup>
        <FormGroup label="Mot de passe" labelFor="text-input">
          <InputGroup
            leftIcon="lock"
            placeholder="Mot de passe"
            type="password"
            value={login.password}
            onChange={(event: React.FormEvent<HTMLElement>): void => {
              const target = event.target as HTMLInputElement;
              setLogin({ ...login, password: target.value });
            }}
          />
        </FormGroup>
        <FormGroup>
          <Button
            disabled={
              loadingLogin || login.password === '' || login.email === ''
            }
            intent="primary"
            large
            loading={loadingLogin}
            type="submit"
          >
            Se connecter
          </Button>
        </FormGroup>
      </form>
    </div>
  );

  return (
    <div>
      <Navbar />
      <div className="formulaires">
        {signupForm}
        {loginForm}
      </div>
    </div>
  );
};

export default AuthenticationView;
