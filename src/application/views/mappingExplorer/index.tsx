import {gql} from 'apollo-boost'
import {
    Alignment,
    Button,
    Card,
    ControlGroup,
    Elevation,
    FormGroup,
    NonIdealState,
    Spinner,
    Tab,
    Tabs,
    TabId,
    Tag,
} from '@blueprintjs/core'
import * as React from 'react'
import {
    Mutation,
    Query,
    Subscription,
} from 'react-apollo'
import {connect} from 'react-redux'

// Import actions
import {
    changeDatabase,
    changeFhirResource,
    updateDatabase,
    updateFhirAttribute,
    updateFhirResource,
} from './actions'

import {
    fetchDatabaseNames,
} from '../../actions/databases'

import {
    fetchFhirResourceNames,
} from '../../actions/fhirResources'

// Import components
import ColumnPicker from '../../components/columnPicker'
import FhirResourceTree from '../../components/fhirResourceTree'
import InputColumnsTable from '../../components/inputColumnsTable'
import StringSelect from '../../components/selects/stringSelect'

// Import types
import {
    IReduxStore,
    IView,
} from '../../types'

import './style.less'

// Requests
const getMappings = require('./queries/getMappings.graphql')
const getAttributes = require('./queries/getAttributes.graphql')
const subscription = require('./queries/subscription.graphql')
const inputColumnMutation = require('./queries/inputColumnMutation.graphql')
const deleteInputColumn = require('./queries/deleteInputColumn.graphql')
const attributeSubscription = require('./queries/attributeSubscription.graphql')
const getInputColumns = require('./queries/getInputColumns.graphql')
const customAttributeSubscription = require('./queries/customAttributeSubscription.graphql')
const updateAttribute = require('./queries/updateAttribute.graphql')
const updateAttributeNoId = require('./queries/updateAttributeNoId.graphql')
const getResource = require('./queries/getResource.graphql')
const subscribeResource = require('./queries/subscribeResource.graphql')
const updateResource = require('./queries/updateResource.graphql')

const arkhnLogo = require("../../img/arkhn_logo_only_white.svg") as string;

export interface IMappingExplorerState {
    selectedDatabase: string,
    selectedFhirResource: string,
    selectedFhirAttribute: string,
}

interface IState {
    columnPicker: {
        owner: string,
        table: string,
        column: string,
    },
    selectedTabId: TabId,
}

interface IMappingExplorerViewState extends IView, IMappingExplorerState {}

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

@reduxify(mapReduxStateToReactProps)
export default class MappingExplorerView extends React.Component<IMappingExplorerViewState, IState> {
    constructor(props: IMappingExplorerViewState) {
        super(props)
        this.state = {
            selectedTabId: 'picker',
            columnPicker: {
                owner: null,
                table: null,
                column: null,
            }
        }
    }

    public componentDidMount() {
        this.props.dispatch(fetchDatabaseNames())
        this.props.dispatch(fetchFhirResourceNames())

        // this.props.dispatch(updateDatabase('Crossway'))
        this.props.dispatch(changeFhirResource('Patient'))
        this.props.dispatch(updateFhirAttribute('link.other'))
    }

    public render = () => {
        const {
            data,
            dispatch,
            selectedDatabase,
            selectedFhirResource,
            selectedFhirAttribute,
        } = this.props

        const {
            columnPicker,
            selectedTabId,
        } = this.state

        const nonIdealState = <NonIdealState
            description={'Select a FHIR resource attribute by clicking on a node in the left panel.'}
            icon={<span dangerouslySetInnerHTML={{__html: arkhnLogo}}/>}
            title={'No FHIR attribute selected'}
        />

        const primaryKeyComponent = <Query
            query={getResource}
            variables={{
                database: selectedDatabase,
                resource: selectedFhirResource,
            }}
            skip={!selectedDatabase || !selectedFhirResource}
        >
            {({ loading, error, data }: any) => {
                let resource = data && data.resources ? data.resources[0] : null
                console.log(resource)

                return resource ? <Subscription
                    subscription={subscribeResource}
                    variables={{
                        id: resource.id,
                    }}
                >
                    {({ data, loading }) => {
                        resource = data && data.subscribeResource ?
                            data.subscribeResource.node :
                            resource
                        console.log(resource)
                        console.log(this.props.data)

                        return <ControlGroup>
                            <Mutation
                                mutation={updateResource}
                            >
                                {(updateResource, {data, loading}) => {
                                    return <StringSelect
                                        inputItem={resource.primaryKey}
                                        items={selectedDatabase ? Object.keys(this.props.data.databases.schemaByDatabaseName[selectedDatabase]) : []}
                                        onChange={(e: string) => {
                                            updateResource({
                                                variables: {
                                                    id: resource.id,
                                                    data: {
                                                        primaryKey: e,
                                                    },
                                                }
                                            })
                                        }}
                                    />
                                }}
                            </Mutation>
                        </ControlGroup>
                    }}
                </Subscription> :
                null
            }}
        </Query>

        const inputColumnsComponent = <Query
            query={getAttributes}
            variables={{
                database: selectedDatabase,
                resource: selectedFhirResource,
                attribute: selectedFhirAttribute,
            }}
            skip={!selectedDatabase ||
                !selectedFhirResource ||
                !selectedFhirAttribute
            }
        >
            {({ loading, error, data }) => {
                {/* Before rendering this view, verify that all
                inconsistent usecases are sorted (is the query loading,
                did it trigger an error, did it return data?) */}
                if (loading) {
                    return <Spinner />
                }
                if (error) {
                    console.log(error)
                    return <p>Something went wrong : {error.message}</p>
                }

                let attribute = data && data.attributes ? data.attributes[0] : null

                {/* Here, one subscribes to changes on the currently displayed
                fhir attribute. This is useful when an input column is added
                or deleted for instance. */}
                return <Subscription
                    subscription={customAttributeSubscription}
                    variables={{
                        database: selectedDatabase,
                        resource: selectedFhirResource,
                        attribute: selectedFhirAttribute,
                    }}
                >
                    {({ data, loading, error }) => {

                        {/* If data.attributeSubscription is available,
                        then it is what we should display since it means
                        an inputColumn was added or deleted. */}
                        attribute = (data && data.customAttributeSubscription) ?
                            data.customAttributeSubscription.node :
                            attribute
                        const inputColumns = (data && data.customAttributeSubscription) ?
                            data.customAttributeSubscription.node.inputColumns :
                            ((attribute && attribute.inputColumns) ? attribute.inputColumns : [])

                        return <div id='input-columns'>
                        <div id='input-column-rows'>
                            {inputColumns.map((inputColumn: any, index: number) => {
                                {/* Each input column will generate a new subscription
                                to the server, so as to make sure the user is always
                                synchronised with information written in the backend. */}
                                return <Subscription
                                    key={index}
                                    subscription={subscription}
                                    variables={{
                                        id: inputColumn.id,
                                    }}
                                >
                                    {({ data, loading }) => {
                                        const column = (data && data.inputColumnSubscription) ?
                                            data.inputColumnSubscription.node :
                                            inputColumn

                                        return column ? <div className='input-column'>
                                            {/* The following mutation allows one to
                                            update the fhir attribute under study
                                            by deleting one of it's input columns.
                                            This allows to re-render all input columns
                                            and re-generate subscriptions*/}
                                            <Mutation
                                                mutation={deleteInputColumn}
                                            >
                                                {(deleteInputColumnName, {data, loading}) => {
                                                    return <Button
                                                        icon={'trash'}
                                                        minimal={true}
                                                        onClick={() => {
                                                            deleteInputColumnName({
                                                                variables: {
                                                                    attributeId: attribute.id,
                                                                    inputColumnId: column.id,
                                                                }
                                                            })
                                                        }}
                                                    />
                                                }}
                                            </Mutation>
                                            <Card elevation={Elevation.ONE} className='input-column-info'>
                                                <div className='input-column-name'>
                                                    <Tag large={true}>{column.owner}</Tag>
                                                    <Tag large={true}>{column.table}</Tag>
                                                    <Tag large={true}>{column.column}</Tag>
                                                </div>
                                                <div className='input-column-join'>
                                                    {/* Here is a simple mutation
                                                    intended to modify input column's
                                                    information. */}
                                                    <Mutation
                                                        mutation={inputColumnMutation}
                                                    >
                                                        {(changeInputColumnJoin, {data, loading}) => {
                                                            return <StringSelect
                                                                inputItem={column.joinSourceColumn}
                                                                items={['toto', 'tutu']}
                                                                onChange={(e: string) => {
                                                                    changeInputColumnJoin({
                                                                        variables: {
                                                                            id: column.id,
                                                                            data: {
                                                                                joinSourceColumn: e,
                                                                            },
                                                                        },
                                                                    })
                                                                }}
                                                            />
                                                        }}
                                                    </Mutation>
                                                </div>
                                                <div className='input-column-script'>
                                                    <Mutation
                                                        mutation={inputColumnMutation}
                                                    >
                                                        {(changeInputColumnScript, {data, loading}) => {
                                                            return <StringSelect
                                                                inputItem={column.script}
                                                                items={['script1.py', 'script2.py']}
                                                                loading={loading}
                                                                onChange={(e: string) => {
                                                                    changeInputColumnScript({
                                                                        variables: {
                                                                            id: column.id,
                                                                            data: {
                                                                                script: e,
                                                                            },
                                                                        },
                                                                    })
                                                                }}
                                                            />
                                                        }}
                                                    </Mutation>
                                                </div>
                                            </Card>
                                        </div> : null
                                    }}
                                </Subscription>
                            })}
                        </div>
                        <div id='input-column-merging-script'>
                            <Mutation
                                mutation={updateAttribute}
                            >
                                {(updateAttribute, {data, loading}) => {
                                    return <StringSelect
                                        inputItem={(attribute && attribute.mergingScript) ? attribute.mergingScript : ''}
                                        items={['mergingScript.py']}
                                        loading={loading}
                                        onChange={(e: string) => {
                                            updateAttribute({
                                                variables: {
                                                    id: attribute.id,
                                                    data: {
                                                        mergingScript: e,
                                                    },
                                                },
                                            })
                                        }}
                                    />
                                }}
                            </Mutation>
                        </div>
                    </div>
                }}
            </Subscription>
            }}
        </Query>

        const columnPickingTab = <div id={'column-picker'}>
            <FormGroup
                label='Choose column'
                labelFor='text-input'
                inline={true}
            >
                <ControlGroup>
                    <ColumnPicker
                        ownerChangeCallback={(e: string) => {
                            this.setState({
                                columnPicker: {
                                    ...this.state.columnPicker,
                                    owner: e,
                                }
                            })
                        }}
                        tableChangeCallback={(e: string) => {
                            this.setState({
                                columnPicker: {
                                    ...this.state.columnPicker,
                                    table: e,
                                }
                            })
                        }}
                        columnChangeCallback={(e: string) => {
                            this.setState({
                                columnPicker: {
                                    ...this.state.columnPicker,
                                    column: e,
                                }
                            })
                        }}
                        databaseSchema={selectedDatabase ? data.databases.schemaByDatabaseName[selectedDatabase] : {}}
                    />
                    <Mutation
                        mutation={updateAttributeNoId}
                    >
                        {(updateAttribute, { data, loading }) => {
                            return <Button
                                disabled={false}
                                icon={'add'}
                                onClick={() => updateAttribute({
                                    variables: {
                                        database: selectedDatabase,
                                        resource: selectedFhirResource,
                                        attribute: selectedFhirAttribute,
                                        data: {
                                            inputColumns: {
                                                create: [
                                                    {
                                                        owner: columnPicker.owner,
                                                        table: columnPicker.table,
                                                        column: columnPicker.column,
                                                    }
                                                ]
                                            }
                                        }
                                    }
                                })}
                            />
                        }}
                    </Mutation>
                </ControlGroup>
            </FormGroup>
        </div>

        const columnSuggestionTab = <div>Suggestions</div>

        const columnSelectionComponent = <div id='column-selection'>
            <Tabs
                onChange={(tabId: TabId) => {
                    this.setState({
                        selectedTabId: tabId,
                    })
                }}
                selectedTabId={selectedTabId}
            >
                <Tab id="picker" title="Simple Selection Tool" panel={columnPickingTab} />
                <Tab id="mb" disabled title="Column Suggestion Tool" panel={columnSuggestionTab} />
            </Tabs>
        </div>

        const fhirResourceTree = <FhirResourceTree
            json={
                selectedFhirResource ?
                    data.fhirResources.jsonByResourceName[selectedFhirResource] :
                    null
            }
            onClickCallback={(attributeFlatPath: any) => {
                dispatch(updateFhirAttribute(attributeFlatPath))
            }}
            selectedNode={selectedFhirAttribute}
        />

        return <div id='mapping-explorer-container'>
            <div id='navbar' className={'bp3-dark'}>
                <div className='flex-row'>
                    <ControlGroup>
                        <StringSelect
                            icon={'database'}
                            inputItem={selectedDatabase}
                            intent={'primary'}
                            items={Object.keys(data.databases.databaseNames)}
                            loading={data.databases.loadingDatabaseNames || data.databases.loadingDatabaseSchema}
                            onChange={(databaseName: string) => {
                                dispatch(changeDatabase(databaseName))
                            }}
                        />
                        <StringSelect
                            icon={'layout-hierarchy'}
                            inputItem={selectedFhirResource}
                            intent={'primary'}
                            items={Object.keys(data.fhirResources.resourceNames)}
                            loading={data.fhirResources.loadingFhirResourceNames || data.fhirResources.loadingFhirResourceJson}
                            onChange={(resource: string) => {
                                dispatch(changeFhirResource(resource))
                            }}
                        />
                    </ControlGroup>
                </div>
                {
                    selectedDatabase && selectedFhirResource ?
                        <div className='flex-row'>
                            <Card>
                                <h4>Primary Key</h4>
                                {primaryKeyComponent}
                            </Card>
                        </div> :
                        null
                }
            </div>

            <div id='main-container'>
                <div id='left-part'>
                    {inputColumnsComponent}
                    {columnSelectionComponent}
                </div>
                <div id='right-part'>
                    <div id='fhir-resource-tree'>
                        {fhirResourceTree}
                    </div>
                </div>
            </div>
        </div>
    }
}
