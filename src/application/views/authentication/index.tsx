import {gql} from 'apollo-boost'
import {
    Button,
    ControlGroup,
    Elevation,
    FormGroup,
    InputGroup,
    Spinner,
} from '@blueprintjs/core'
import * as React from 'react'
import {
    Mutation,
    Query,
    Subscription,
} from 'react-apollo'
import {connect} from 'react-redux'

import { AUTH_TOKEN } from '../../constant'

// Import actions
// import {
//     changeDatabase,
//     updateDatabase,
//     updateFhirAttribute,
//     updateFhirResource,
// } from './actions'

// Import types
import {
    IReduxStore,
    IView,
} from '../../types'

import './style.less'

// Requests
const mutationSignup = require('./graphql/mutationSignup.graphql')
const mutationLogin = require('./graphql/mutationLogin.graphql')

const arkhnLogoWhite = require("../../img/arkhn_logo_only_white.svg") as string;
const arkhnLogoBlack = require("../../img/arkhn_logo_only_black.svg") as string;

export interface IMappingExplorerState {
    selectedDatabase: string,
    selectedFhirResource: string,
    selectedFhirAttribute: string[],
}

interface IState {
    login: {
        email: string,
        password: string,
    },
    signup: {
        email: string,
        name: string,
        password: string,
        confirmPassword: string
    },
}

interface IMappingExplorerViewState extends IView, IMappingExplorerState {}

const mapReduxStateToReactProps = (state : IReduxStore): IMappingExplorerViewState => {
    return {
        ...state.views.mappingExplorer,
        data: state.data,
        dispatch: state.dispatch,
    }
}

const reduxify = (mapReduxStateToReactProps: any, mapDispatchToProps?: any, mergeProps?: any, options?: any) : any => {
     return (target: any) => (
         connect(
             mapReduxStateToReactProps,
             mapDispatchToProps,
             mergeProps,
             options
         )(target) as any
     )
}

@reduxify(mapReduxStateToReactProps)
export default class MappingExplorerView extends React.Component<IMappingExplorerViewState, IState> {
    constructor(props: IMappingExplorerViewState) {
        super(props)
        this.state = {
            login: {
                email: "",
                password: "",
            },
            signup: {
                email: "",
                name: "",
                password: "",
                confirmPassword: ""
            },
        }
    }

    public componentDidMount() {
        // this.props.dispatch(updateDatabase('Crossway'))
        // this.props.dispatch(changeFhirResource('Patient'))
        // this.props.dispatch(updateFhirAttribute('link.other'))
    }

    public render = () => {
        const {
            data,
            dispatch,
            // selectedDatabase,
            // selectedFhirResource,
            // selectedFhirAttribute,
        } = this.props

        const {
            login,
            signup,
        } = this.state

        return <div>
            <div className='formulaires'>
                <div className='signup-form'>
                    <h2>S'inscrire</h2>
                    <FormGroup
                        label="Adresse mail"
                        labelFor="text-input"
                    >
                        <InputGroup
                            leftIcon="inbox"
                            placeholder="Email"
                            value={signup.email}
                            onChange={(event: React.FormEvent<HTMLElement>) => {
                                const target = event.target as HTMLInputElement

                                this.setState({
                                    signup: {
                                        ...this.state.signup,
                                        email: target.value,
                                    }
                                })
                            }}
                        />
                    </FormGroup>
                    <FormGroup
                        label="Nom"
                        labelFor="text-input"
                    >
                        <InputGroup
                            leftIcon="user"
                            placeholder="Nom"
                            value={signup.name}
                            onChange={(event: React.FormEvent<HTMLElement>) => {
                                const target = event.target as HTMLInputElement

                                this.setState({
                                    signup: {
                                        ...this.state.signup,
                                        name: target.value,
                                    }
                                })
                            }}
                        />
                    </FormGroup>
                    <FormGroup
                        label="Mot de passe"
                        labelFor="text-input"
                    >
                        <InputGroup
                            leftIcon="lock"
                            placeholder="Mot de passe"
                            type="password"
                            value={signup.password}
                            onChange={(event: React.FormEvent<HTMLElement>) => {
                                const target = event.target as HTMLInputElement

                                this.setState({
                                    signup: {
                                        ...this.state.signup,
                                        password: target.value,
                                    }
                                })
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
                            type="password"
                            value={signup.confirmPassword}
                            onChange={(event: React.FormEvent<HTMLElement>) => {
                                const target = event.target as HTMLInputElement

                                this.setState({
                                    signup: {
                                        ...this.state.signup,
                                        confirmPassword: target.value,
                                    }
                                })
                            }}
                        />
                    </FormGroup>
                    <Mutation
                        mutation={mutationSignup}
                    >
                        {(mutationSignup, {data, loading}) => {
                            const authenticated = data && data.signup && data.signup.token

                            if (authenticated) {
                                const token = data.signup.token

                                localStorage.setItem(AUTH_TOKEN, token)

                                {/* this.props.history.replace('/') */}
                                window.location.reload()
                            }

                            return <div>
                                <Button
                                    disabled={loading || signup.password == "" || signup.password != signup.confirmPassword}
                                    intent="primary"
                                    onClick={() => {
                                        mutationSignup({
                                            variables: {
                                                email: signup.email,
                                                name: signup.name,
                                                password: signup.password,
                                            }
                                        })
                                    }}
                                >
                                    S'inscrire
                                </Button>
                                {loading ?
                                    <Spinner /> :
                                    null
                                }
                            </div>
                        }}
                    </Mutation>
                </div>
                <div className='login-form'>
                    <h2>Se connecter</h2>
                    <FormGroup
                        label="Adresse mail"
                        labelFor="text-input"
                    >
                        <InputGroup
                            leftIcon="user"
                            placeholder="Email"
                            value={login.email}
                            onChange={(event: React.FormEvent<HTMLElement>) => {
                                const target = event.target as HTMLInputElement

                                this.setState({
                                    login: {
                                        ...this.state.login,
                                        email: target.value,
                                    }
                                })
                            }}
                        />
                    </FormGroup>
                    <FormGroup
                        label="Mot de passe"
                        labelFor="text-input"
                    >
                        <InputGroup
                            leftIcon="lock"
                            placeholder="Mot de passe"
                            type="password"
                            value={login.password}
                            onChange={(event: React.FormEvent<HTMLElement>) => {
                                const target = event.target as HTMLInputElement

                                this.setState({
                                    login: {
                                        ...this.state.login,
                                        password: target.value,
                                    }
                                })
                            }}
                        />
                    </FormGroup>
                    <Mutation
                        mutation={mutationLogin}
                    >
                        {(mutationLogin, {data, loading}) => {
                            const authenticated = data && data.login && data.login.token

                            if (authenticated) {
                                const token = data.login.token

                                localStorage.setItem(AUTH_TOKEN, token)

                                {/* this.props.history.replace('/') */}
                                {/* window.location.reload() */}
                                console.log(token)
                            }

                            return <div>
                                <Button
                                    disabled={loading || login.password == "" || login.email == ""}
                                    intent="primary"
                                    onClick={() => {
                                        mutationLogin({
                                            variables: {
                                                email: login.email,
                                                password: login.password,
                                            }
                                        })
                                    }}
                                >
                                    Se connecter
                                </Button>
                                {loading ?
                                    <Spinner /> :
                                    null
                                }
                            </div>
                        }}
                    </Mutation>
                </div>
            </div>
        </div>
    }
}
