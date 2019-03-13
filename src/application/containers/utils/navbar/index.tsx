import {
    Alignment,
    Button,
    Navbar as BPNavbar,
    Spinner,
} from '@blueprintjs/core'
import * as React from 'react'
import {
    Mutation,
    Query,
    Subscription,
} from 'react-apollo'
import { connect } from 'react-redux'
import { Redirect } from 'react-router'
import { withRouter } from 'react-router-dom'

import { AUTH_TOKEN } from '../../../constant'

import { login, logout } from '../../../actions/user'

// Import types
import {
    IReduxStore,
    IView,
} from '../../../types'

import './style.less'

// GRAPHQL OPERATIONS

// Queries
const isAuthenticated = require('./graphql/queries/isAuthenticated.graphql')
const me = require('./graphql/queries/me.graphql')

export interface IProps extends IView {
    history?: any,
}

interface IState {

}

const mapReduxStateToReactProps = (state : IReduxStore): IProps => {
    return {
        data: state.data,
        dispatch: state.dispatch,
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

    public render = () => {
        const {
            dispatch,
            user,
        } = this.props

        console.log(this.props)

        const userInformation = <Query
            query={me}
            skip={user.info.name !== null}
        >
            {({ data, loading }) => {
                if (data && data.me) {
                    const {id, name, email} = data.me
                    dispatch(login(id, name, email))
                    this.props.history.push('/softwares')
                }

                return loading ?
                    <BPNavbar.Group align={Alignment.RIGHT}>
                        <Spinner size={15} />
                    </BPNavbar.Group> :
                    user.isAuthenticated ?
                        <BPNavbar.Group align={Alignment.RIGHT}>
                            {user.info.name}
                            <BPNavbar.Divider />
                            <Button
                                className="bp3-minimal"
                                icon="log-out"
                                onClick={() => {
                                    localStorage.removeItem(AUTH_TOKEN)
                                    dispatch(logout())
                                    this.props.history.push('/')
                                }}
                                text="Se déconnecter"
                            />
                        </BPNavbar.Group> :
                        null

            }}
        </Query>

        return <BPNavbar id="navbar" className="bp3-dark">
            <BPNavbar.Group align={Alignment.LEFT}>
                <BPNavbar.Heading>Fhirball</BPNavbar.Heading>
            </BPNavbar.Group>
            <Query
                query={isAuthenticated}
                skip={user.isAuthenticated}
            >
                {({ data, loading }) => {
                    return loading ?
                        <BPNavbar.Group align={Alignment.RIGHT}>
                            <Spinner size={15} />
                        </BPNavbar.Group> :
                        data && data.isAuthenticated || user.isAuthenticated ?
                            userInformation :
                            null
                }}
            </Query>
        </BPNavbar>
    }
}

export default withRouter(connect(mapReduxStateToReactProps)(Navbar) as any)
