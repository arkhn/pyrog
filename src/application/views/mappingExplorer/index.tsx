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
    changeFhirResource,
    updateDatabase,
    updateFhirAttribute,
    updateFhirResource,
} from './actions'

import {
    fetchFhirResourceNames,
} from '../../actions/fhirResources'

// Import components
import FhirResourceTree from '../../components/fhirResourceTree'
import InputColumnsTable from '../../components/inputColumnsTable'
import StringSelect from '../../components/selects/stringSelect'

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

const getInputColumns = gql`
query inputColumns($database: String!, $resource: String!, $attribute: String!) {
    mappings (where: {database: $database}) {
        id
        database
        resources (where: {name: $resource}) {
            id
            name
            attributes (where: {name: $attribute}) {
                id
                name
                inputColumns {
                    id
                    owner
                    table
                    column
                }
            }
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

@reduxify(mapReduxStateToReactProps)
export default class MappingExplorerView extends React.Component<IMappingExplorerViewState, any> {
    public componentDidMount() {
        this.props.dispatch(updateDatabase('crossway'))
        this.props.dispatch(changeFhirResource('Patient'))
        this.props.dispatch(updateFhirAttribute('name.given'))

        this.props.dispatch(fetchFhirResourceNames('https://api.live.arkhn.org/fhir_resources'))
    }

    public render = () => {
        const {
            data,
            dispatch,
            selectedDatabase,
            selectedFhirResource,
            selectedFhirAttribute,
        } = this.props

        return <div id='mapping-explorer-container'>
            <div id='left-part'>
                <div className={'panel-header'}>
                    <StringSelect
                        icon={'database'}
                        inputItem={selectedDatabase}
                        intent={'primary'}
                        items={[]}
                        loading={null}
                        onChange={null}
                    />
                </div>

                <Query
                    query={getInputColumns}
                    variables={{
                        database: selectedDatabase,
                        resource: selectedFhirResource,
                        attribute: selectedFhirAttribute,
                    }}
                >
                    {({ loading, error, data }) => {
                        if (loading) {
                            return <p>Loading...</p>
                        }
                        if (error) {
                            console.log('Went through an error...')
                            console.log(error)
                            return <p>Something went wrong</p>
                        }

                        return <div>
                            <InputColumnsTable
                                inputColumns={data.mappings[0].resources[0].attributes[0].inputColumns}
                                databaseSchema={null}
                            />
                        </div>
                    }}
                </Query>
            </div>
            <div id='right-part'>
                <div className={'panel-header'}>
                    <StringSelect
                        icon={'layout-hierarchy'}
                        inputItem={selectedFhirResource}
                        intent={'primary'}
                        items={Object.keys(data.fhirResources.resourceNames)}
                        loading={data.fhirResources.loadingFhirResourceNames}
                        onChange={(resource: string) => {
                            dispatch(changeFhirResource(resource))
                        }}
                    />
                </div>
                <FhirResourceTree
                    json={
                        selectedFhirResource ?
                            data.fhirResources.jsonByResourceName[selectedFhirResource] :
                            null
                    }
                />
            </div>
        </div>
    }
}
