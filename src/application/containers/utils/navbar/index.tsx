import {
    Alignment,
    Button,
    IToastProps,
    Navbar as BPNavbar,
    Spinner,
    Toast,
    Toaster,
} from '@blueprintjs/core'
import * as React from 'react'
import { gql } from 'apollo-client-preset'
import {
    Mutation,
    Query,
    Subscription,
    withApollo,
} from 'react-apollo'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { AUTH_TOKEN } from '../../../constants'

import { login, logout } from '../../../actions/user'
import { deselectDatabase } from '../../../actions/selectedDatabase'

// Import types
import {
    IReduxStore,
    IView,
} from '../../../types'

import './style.less'

// LOGO
const arkhnLogoWhite = require("../../../../assets/img/arkhn_logo_only_white.svg")

// GRAPHQL OPERATIONS

// Queries
const isAuthenticated = require('./graphql/queries/isAuthenticated.graphql')
const me = require('./graphql/queries/me.graphql')

export interface IProps extends IView {

}

interface IState {

}

const mapReduxStateToReactProps = (state : IReduxStore): IProps => {
    return {
        data: state.data,
        dispatch: state.dispatch,
        selectedDatabase: state.selectedDatabase,
        toaster: state.toaster,
        user: state.user,
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

class Navbar extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
    }

    componentDidMount = () => {
        // Check if user is authentified and redirect accordingly.
        this.props.client
            .query({
                query: gql`query { isAuthenticated }`,
                // This query should not use the cache,
                // or else users can't log in and out.
                fetchPolicy: "network-only",
            })
            .then((response: any) => {
                if (response.data.isAuthenticated) {
                    if (this.props.location.pathname == "/mapping" && !this.props.selectedDatabase.name) {
                        this.props.history.push('/sources')
                    }
                    if (["/", "/signin"].indexOf(this.props.location.pathname) >= 0) {
                        this.props.history.push('/sources')
                    }
                } else if (this.props.location.pathname != "/signin") {
                    this.props.history.push('/signin')
                }
            })
    }

    public render = () => {
        const {
            dispatch,
            selectedDatabase,
            user,
        } = this.props

        const logo = <BPNavbar.Heading>
            <span dangerouslySetInnerHTML={{__html: arkhnLogoWhite}} />
        </BPNavbar.Heading>

        const header = () => {
            switch (this.props.location.pathname) {
                case '/newSource': {
                    return <BPNavbar.Group align={Alignment.LEFT}>
                        {logo}
                        <Button
                            icon={'chevron-left'}
                            intent={'primary'}
                            minimal={true}
                            onClick={() => {
                                this.props.history.push('/sources')
                            }}
                        >
                            Sources
                        </Button>
                    </BPNavbar.Group>
                }

                case '/mapping': {
                    return selectedDatabase.name !== null ?
                        <BPNavbar.Group align={Alignment.LEFT}>
                            {logo}
                            <Button
                                icon={'chevron-left'}
                                intent={'primary'}
                                minimal={true}
                                onClick={() => {
                                    dispatch(deselectDatabase())
                                    this.props.history.push('/sources')
                                }}
                            >
                                Sources
                            </Button>
                            <BPNavbar.Divider />
                            {selectedDatabase.name}
                        </BPNavbar.Group> :
                        <BPNavbar.Group align={Alignment.LEFT}>
                            {logo}
                        </BPNavbar.Group>
                }

                default:
                    return <BPNavbar.Group align={Alignment.LEFT}>
                        {logo}
                    </BPNavbar.Group>
            }
        }

        return <BPNavbar id="navbar" className="bp3-dark">
            {header()}
            <Query
                onCompleted={(data: any) => {
                    if (data && data.me && user.id === null) {
                        dispatch(login(data.me.id, data.me.name, data.me.email))
                    }
                }}
                query={me}
                skip={user.id !== null}
            >
                {({ data, loading }) => {
                    return loading ?
                        <BPNavbar.Group align={Alignment.RIGHT}>
                            <Spinner size={15} />
                        </BPNavbar.Group> :
                        (user.id ?
                            <BPNavbar.Group align={Alignment.RIGHT}>
                                {user.name}
                                <BPNavbar.Divider />
                                <Button
                                    className="bp3-minimal"
                                    icon="log-out"
                                    onClick={() => {
                                        localStorage.removeItem(AUTH_TOKEN)
                                        dispatch(logout())
                                        this.props.history.push('/signin')
                                    }}
                                    text="Se déconnecter"
                                />
                            </BPNavbar.Group> :
                            null)
                }}
            </Query>
        </BPNavbar>
    }
}

export default withRouter(withApollo(connect(mapReduxStateToReactProps)(Navbar) as any) as any)
