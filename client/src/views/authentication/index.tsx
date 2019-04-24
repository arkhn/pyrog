import {
  Button,
  ControlGroup,
  Elevation,
  FormGroup,
  Icon,
  InputGroup,
  Spinner,
  Tag
} from "@blueprintjs/core";
import * as React from "react";
import { Mutation, Query, Subscription } from "react-apollo";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import Navbar from "../../utils/navbar";

import { login as loginAction } from "../../actions/user";

// Import types
import { IReduxStore, IView } from "../../types";

import "./style.less";

// GRAPHQL OPERATIONS

// Queries
const isAuthenticated = require("../../graphql/queries/isAuthenticated.graphql");

// Mutations
const mutationLogin = require("../../graphql/mutations/login.graphql");
const mutationSignup = require("../../graphql/mutations/signup.graphql");

export interface IAuthenticationState {}

interface IState {
  login: {
    email: string;
    password: string;
  };
  signup: {
    email: string;
    name: string;
    password: string;
    confirmPassword: string;
  };
}

interface IAuthenticationViewState extends IView, IAuthenticationState {}

const mapReduxStateToReactProps = (
  state: IReduxStore
): IAuthenticationViewState => {
  return {
    data: state.data,
    dispatch: state.dispatch,
    toaster: state.toaster,
    user: state.dispatch
  };
};

const reduxify = (
  mapReduxStateToReactProps: any,
  mapDispatchToProps?: any,
  mergeProps?: any,
  options?: any
): any => {
  return (target: any) =>
    connect(
      mapReduxStateToReactProps,
      mapDispatchToProps,
      mergeProps,
      options
    )(target) as any;
};

class AuthenticationView extends React.Component<
  IAuthenticationViewState,
  IState
> {
  constructor(props: IAuthenticationViewState) {
    super(props);
    this.state = {
      login: {
        email: "",
        password: ""
      },
      signup: {
        email: "",
        name: "",
        password: "",
        confirmPassword: ""
      }
    };
  }

  public render = () => {
    const { data, dispatch } = this.props;

    const { login, signup } = this.state;

    const formulaires = (
      <div className="formulaires">
        <div className="signup-form">
          <h2>S'inscrire</h2>
          <Mutation
            mutation={mutationSignup}
            onCompleted={(data: any) => {
              if (data.signup.token) {
                const token = data.signup.token;
                const { id, name, email } = data.signup.user;
                localStorage.setItem(process.env.AUTH_TOKEN, token);
                dispatch(loginAction(id, name, email));
                this.props.history.push("/sources");
              }
            }}
            onError={(error: any) => {
              this.props.toaster.show({
                icon: "error",
                intent: "danger",
                message:
                  error.message ==
                  "GraphQL error: A unique constraint would be violated on User. Details: Field name = email"
                    ? "L'adresse mail est déjà enregistrée."
                    : "Une erreur est survenue lors de l'inscription.",
                timeout: 4000
              });
            }}
          >
            {(mutationSignup: any, { data, loading }: any) => {
              return (
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

                        this.setState({
                          signup: {
                            ...this.state.signup,
                            email: target.value
                          }
                        });
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

                        this.setState({
                          signup: {
                            ...this.state.signup,
                            name: target.value
                          }
                        });
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

                        this.setState({
                          signup: {
                            ...this.state.signup,
                            password: target.value
                          }
                        });
                      }}
                    />
                  </FormGroup>
                  <FormGroup
                    label="Confirmation du mot de passe"
                    labelFor="text-input"
                  >
                    <InputGroup
                      leftIcon="lock"
                      placeholder="Mot de passe"
                      rightElement={
                        signup.confirmPassword ? (
                          signup.confirmPassword != signup.password ? (
                            <Tag minimal={true}>
                              <Icon color={"#EB532D"} icon={"cross"} />
                            </Tag>
                          ) : (
                            <Tag minimal={true}>
                              <Icon color={"#15B371"} icon={"tick"} />
                            </Tag>
                          )
                        ) : (
                          <Tag className={"hidden"} minimal={true}>
                            <Icon icon={"tick"} />
                          </Tag>
                        )
                      }
                      type="password"
                      value={signup.confirmPassword}
                      onChange={(event: React.FormEvent<HTMLElement>) => {
                        const target = event.target as HTMLInputElement;

                        this.setState({
                          signup: {
                            ...this.state.signup,
                            confirmPassword: target.value
                          }
                        });
                      }}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Button
                      disabled={
                        loading ||
                        signup.password == "" ||
                        signup.password != signup.confirmPassword
                      }
                      intent="primary"
                      large
                      loading={loading}
                      type={"submit"}
                    >
                      S'inscrire
                    </Button>
                  </FormGroup>
                </form>
              );
            }}
          </Mutation>
        </div>
        <div className="login-form">
          <h2>Se connecter</h2>
          <Mutation
            mutation={mutationLogin}
            onCompleted={(data: any) => {
              if (data.login.token) {
                const token = data.login.token;
                const { id, name, email } = data.login.user;
                localStorage.setItem(process.env.AUTH_TOKEN, token);
                dispatch(loginAction(id, name, email));
                this.props.history.push("/sources");
              }
            }}
            onError={(error: any) => {
              this.props.toaster.show({
                icon: "error",
                intent: "danger",
                message:
                  error.message == "GraphQL error: Invalid password"
                    ? "Le mot de passe est incorrect."
                    : error.message.startsWith(
                        "GraphQL error: No such user found for email"
                      )
                    ? "L'adresse utilisée n'est pas enregistrée."
                    : "Une erreur est survenue lors de l'authentification.",
                timeout: 4000
              });
            }}
          >
            {(mutationLogin: any, { data, loading }: any) => {
              return (
                <form
                  onSubmit={(e: any) => {
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
                      onChange={(event: React.FormEvent<HTMLElement>) => {
                        const target = event.target as HTMLInputElement;

                        this.setState({
                          login: {
                            ...this.state.login,
                            email: target.value
                          }
                        });
                      }}
                    />
                  </FormGroup>
                  <FormGroup label="Mot de passe" labelFor="text-input">
                    <InputGroup
                      leftIcon="lock"
                      placeholder="Mot de passe"
                      type="password"
                      value={login.password}
                      onChange={(event: React.FormEvent<HTMLElement>) => {
                        const target = event.target as HTMLInputElement;

                        this.setState({
                          login: {
                            ...this.state.login,
                            password: target.value
                          }
                        });
                      }}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Button
                      disabled={
                        loading || login.password == "" || login.email == ""
                      }
                      intent="primary"
                      large
                      loading={loading}
                      type="submit"
                    >
                      Se connecter
                    </Button>
                  </FormGroup>
                </form>
              );
            }}
          </Mutation>
        </div>
      </div>
    );

    return (
      <div>
        <Navbar />
        {formulaires}
      </div>
    );
  };
}

export default withRouter(connect(mapReduxStateToReactProps)(
  AuthenticationView
) as any);
