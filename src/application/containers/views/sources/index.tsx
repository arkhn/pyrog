import {
    Button,
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
const computeDatabaseMappingProgress = require('./graphql/queries/computeDatabaseMappingProgress.graphql')

export interface ISourcesState {

}

interface IState {

}

interface ISourcesViewState extends IView, ISourcesState {}

const mapReduxStateToReactProps = (state : IReduxStore): ISourcesViewState => {
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

class SourcesView extends React.Component<ISourcesViewState, IState> {
    constructor(props: ISourcesViewState) {
        super(props)
    }

    public render = () => {
        const {
            data,
            dispatch,
        } = this.props

        return <div>
            <Navbar />
            <div id='main-container-softwares'>
                <Button
                    icon={'add'}
                    intent={'primary'}
                    large={true}
                    onClick={() => {
                        this.props.history.push('/newSource')
                    }}
                >
                    Ajouter un logiciel
                </Button>
                <Query
                    query={allDatabases}
                >
                    {({ data, loading }) => {
                        return <div id="software-cards">
                            {loading ?
                                <Spinner /> :
                                data.allDatabases.map((database: any, index: number) => {
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

                                        <div>
                                            <Query
                                                query={computeDatabaseMappingProgress}
                                                variables={{
                                                    databaseId: database.id,
                                                }}
                                                skip={!database.id}
                                            >
                                                {({ data, loading }) => {
                                                    let numberResources = null
                                                    let numberAttributes = null

                                                    if (data && data.computeDatabaseMappingProgress) {
                                                        numberResources = data.computeDatabaseMappingProgress[0]
                                                        numberAttributes = data.computeDatabaseMappingProgress[1]
                                                    }

                                                    return loading ?
                                                        <Spinner size={15} /> :
                                                        <div className='flexbox'>
                                                            <span>
                                                                <Icon icon='layout-hierarchy' color='#5C7080'/>
                                                                <span>{numberResources} Ressources</span>
                                                            </span>
                                                            <span>
                                                                <Icon icon='tag' color='#5C7080'/>
                                                                <span>{numberAttributes} Attributs</span>
                                                            </span>
                                                        </div>
                                                }}
                                            </Query>
                                        </div>
                                    </Card>
                                })
                            }
                        </div>
                    }}
                </Query>
            </div>
        </div>
    }
}

export default withRouter(connect(mapReduxStateToReactProps)(SourcesView) as any)
