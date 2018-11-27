import {gql} from 'apollo-boost'
import {
    Button,
} from '@blueprintjs/core'
import * as React from 'react'
import {
    Mutation,
    Query,
} from 'react-apollo'

// Import actions

// Import components

// Import mock data

// Import types
import {
    IMappingExplorerViewState,
} from '../../types'

import './style.less'

import getMapping from './queries/a.graphql'

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
export default class MappingExplorerView extends React.Component<IMappingExplorerViewState, any> {
    public componentDidMount() {

    }

    public render = () => {
        return <Query
            query={getMappings}
            variables={{
                database: "crossway",
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
    }
}
