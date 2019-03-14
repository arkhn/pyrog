import {
    Card,
    Elevation,
    Icon,
    Spinner,
    Tag,
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

import Navbar from '../../utils/navbar'

import { changeSelectedDatabase } from '../../../actions/selectedDatabase'

// Import types
import {
    IReduxStore,
    IView,
} from '../../../types'

import './style.less'

// GRAPHQL OPERATIONS

// Queries
const allDatabases = require('./graphql/queries/allDatabases.graphql')

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
                                        dispatch(changeSelectedDatabase(database.id, database.name))
                                        console.log('callback schema')
                                        this.props.history.push('/mapping')
                                    }}
                                >
                                    <h2>{database.name}</h2>
                                    <div className='tags'>
                                        <Tag>DPI</Tag>
                                        <Tag>Généraliste</Tag>
                                        <Tag>Prescription</Tag>
                                    </div>

                                    <div className='flexbox'>
                                        <span>
                                            <Icon icon='layout-hierarchy' color='#5C7080'/>
                                            <span>6 Ressources</span>
                                        </span>
                                        <span>
                                            <Icon icon='tag' color='#5C7080'/>
                                            <span>94 Attributs</span>
                                        </span>
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
