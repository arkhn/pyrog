import {gql} from 'apollo-boost'
import {
    Button,
} from '@blueprintjs/core'
import * as React from 'react'
import {
    Mutation,
    Query,
} from 'react-apollo'
import {connect} from 'react-redux'

// Import actions
import {
    updateDatabase,
} from './actions'

// Import components

// Import mock data

// Import types
import {
    IMappingExplorerViewState,
    IReduxStore,
} from '../../types'

import './style.less'

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

const getMappings = gql`
query Mapping($database: String!) {
    mapping (database: $database) {
        id
        database
        resources {
            id
            name
            primaryKey
        }
    }
}
`

const myMutation = gql`
mutation updateFunction($id: ID!, $primaryKey: String!) {
    updateResourcePrimaryKey(id: $id, primaryKey: $primaryKey) {
        id
        name
        primaryKey
    }
}
`

// @graphqlify(MyQuery, mapQueriesToProps)
@reduxify(mapReduxStateToReactProps)
export default class MappingExplorerView extends React.Component<IMappingExplorerViewState, any> {
    public componentDidMount() {

    }

    public render = () => {
        return <div>
            <Button
                onClick={() => {
                    updateDatabase('crossway')
                }}
            >
                Change Database
            </Button>
            <Query
                query={getMappings}
                variables={{
                    database: this.props.selectedDatabase,
                }}
            >
                {({ loading, error, data }) => {
                    if (loading) {
                        return <p>Loading...</p>;
                    }
                    if (error) {
                        return <p>{error}</p>;
                    }

                    return data.mapping.resources.map((resource: any) => {
                        return <Mutation
                            mutation={myMutation}
                            key={resource.id}
                        >
                            {(updateFunction, { loading, error }) => (
                                <div>
                                    {`${resource.name} - ${resource.primaryKey}`}
                                    <Button
                                        onClick={() => {
                                            updateFunction({
                                                variables: {
                                                    id: resource.id,
                                                    primaryKey: "Salut Theo",
                                                }
                                            })
                                        }}
                                    >
                                        Click ffs
                                    </Button>
                                </div>
                            )}
                        </Mutation>
                    })
                }}
            </Query>
        </div>
    }
}
