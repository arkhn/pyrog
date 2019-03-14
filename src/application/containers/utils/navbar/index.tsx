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
import { withRouter } from 'react-router-dom'

import { AUTH_TOKEN } from '../../../constant'

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
    history?: any,
}

interface IState {

}

const mapReduxStateToReactProps = (state : IReduxStore): IProps => {
    return {
        data: state.data,
        dispatch: state.dispatch,
        selectedDatabase: state.selectedDatabase,
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
            selectedDatabase,
            user,
        } = this.props

        const userInformation = <Query
            query={me}
            skip={user.info.name !== null}
        >
            {({ data, loading }) => {
                if (data && data.me) {
                    const {id, name, email} = data.me
                    dispatch(login(id, name, email))
                    console.log('callback')
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
                                    console.log('callback')
                                    this.props.history.push('/')
                                }}
                                text="Se déconnecter"
                            />
                        </BPNavbar.Group> :
                        null

            }}
        </Query>

        const logo = <BPNavbar.Heading>
            <span dangerouslySetInnerHTML={{__html: arkhnLogoWhite}} />
        </BPNavbar.Heading>

        const heading = selectedDatabase.name !== null ?
            <BPNavbar.Group align={Alignment.LEFT}>
                {logo}
                <Button
                    icon={'chevron-left'}
                    intent={'primary'}
                    minimal={true}
                    onClick={() => {
                        dispatch(deselectDatabase())
                        this.props.history.push('/softwares')
                    }}
                >
                    Logiciels
                </Button>
                <BPNavbar.Divider />
                {selectedDatabase.name}
            </BPNavbar.Group> :
            <BPNavbar.Group align={Alignment.LEFT}>
                {logo}
            </BPNavbar.Group>

        return <BPNavbar id="navbar" className="bp3-dark">
            {heading}
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
