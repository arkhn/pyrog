import {
    Card,
    Elevation,
    Icon,
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

import Navbar from '../../utils/navbar'

import { changeDatabase } from '../mappingExplorer/actions'

// Import types
import {
    IReduxStore,
    IView,
} from '../../../types'

import './style.less'

// GRAPHQL OPERATIONS

// Queries
const allDatabases = require('./graphql/queries/allDatabases.graphql')

// LOGOS
const arkhnLogoWhite = require("../../../img/arkhn_logo_only_white.svg") as string;
const arkhnLogoBlack = require("../../../img/arkhn_logo_only_black.svg") as string;

export interface ISoftwaresState {
    history?: any,
}

interface IState {

}

interface ISoftwaresViewState extends IView, ISoftwaresState {}

const mapReduxStateToReactProps = (state : IReduxStore): ISoftwaresViewState => {
    return {
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

class SoftwaresView extends React.Component<ISoftwaresViewState, IState> {
    constructor(props: ISoftwaresViewState) {
        super(props)
    }

    public render = () => {
        const {
            data,
            dispatch,
        } = this.props

        return <div>
            <Navbar />
            <Query
                query={allDatabases}
            >
                {({ data, loading }) => {
                    return loading ?
                        <Spinner /> :
                        <div id="software-cards">
                            {data.allDatabases.map((database: any, index: number) => {
                                return <Card
                                    elevation={Elevation.TWO}
                                    interactive={true}
                                    key={index}
                                    onClick={() => {
                                        dispatch(changeDatabase(database.id, database.name))
                                        this.props.history.push('/mapping')
                                    }}
                                >
                                    <h2>{database.name}</h2>
                                    <p>Dossier Patient Informatisé présent dans 30% des hôpitaux français.</p>

                                    <div className='flexbox'>
                                        <span><Icon icon='layout-hierarchy' color='#5C7080'/><span>6 Ressources</span></span>
                                        <span><Icon icon='tag' color='#5C7080'/><span>39 Attributs</span></span>
                                    </div>
                                </Card>
                            })}
                        </div>
                }}
            </Query>
        </div>
    }
}

export default withRouter(connect(mapReduxStateToReactProps)(SoftwaresView) as any)
