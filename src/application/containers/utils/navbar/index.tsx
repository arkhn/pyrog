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

// @reduxify(mapReduxStateToReactProps)
class Navbar extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
    }

    public render = () => {
        const {
            user,
        } = this.props

        console.log(this.props)

        const userInformation = <Query
            query={me}
            skip={user.info.name !== null}
        >
            {({ data, loading }) => {
                return loading ?
                    <Spinner /> :
                    <BPNavbar.Group align={Alignment.RIGHT}>
                        {data.me.name}
                        <BPNavbar.Divider />
                        <Button
                            className="bp3-minimal"
                            icon="log-out"
                            onClick={() => {
                                localStorage.removeItem(AUTH_TOKEN)
                                this.props.history.push('/')
                            }}
                            text="Se déconnecter"
                        />
                    </BPNavbar.Group>
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
                        <Spinner /> :
                        data && data.isAuthenticated ?
                            userInformation :
                            null
                }}
            </Query>
        </BPNavbar>
    }
}

export default withRouter(connect(mapReduxStateToReactProps)(Navbar) as any)
