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
const getAttributes = require('./queries/getAttributes.graphql')
const getResource = require('./queries/getResource.graphql')
const mutationAttribute = require('./queries/mutationAttribute.graphql')
const mutationAttributeNoId = require('./queries/mutationAttributeNoId.graphql')
const mutationDeleteInputColumn = require('./queries/mutationDeleteInputColumn.graphql')
const mutationInputColumn = require('./queries/mutationInputColumn.graphql')
const mutationResource = require('./queries/mutationResource.graphql')
const subscriptionAttribute = require('./queries/subscriptionAttribute.graphql')
const subscriptionInputColumn = require('./queries/subscriptionInputColumn.graphql')
const subscriptionResource = require('./queries/subscriptionResource.graphql')

const arkhnLogoWhite = require("../../img/arkhn_logo_only_white.svg") as string;
const arkhnLogoBlack = require("../../img/arkhn_logo_only_black.svg") as string;

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
    toggledNavBar: boolean,
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
            columnPicker: {
                owner: null,
                table: null,
                column: null,
            },
            selectedTabId: 'picker',
            toggledNavBar: false,
        }
    }

    public componentDidMount() {
        this.props.dispatch(fetchDatabaseNames())
        this.props.dispatch(fetchFhirResourceNames())

        // this.props.dispatch(updateDatabase('Crossway'))
        // this.props.dispatch(changeFhirResource('Patient'))
        // this.props.dispatch(updateFhirAttribute('link.other'))
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
            toggledNavBar,
        } = this.state

        const initialMessage = <NonIdealState
            description={'Please select a Database and Fhir Resource'}
            icon={<span dangerouslySetInnerHTML={{__html: arkhnLogoBlack}}/>}
            title={'Fhirball'}
        />

        const attributeMessage = <NonIdealState
            description={'Please select a Fhir Attribute'}
            icon={<span dangerouslySetInnerHTML={{__html: arkhnLogoBlack}}/>}
            title={'Fhirball'}
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

                return resource ? <Subscription
                    subscription={subscriptionResource}
                    variables={{
                        id: resource.id,
                    }}
                >
                    {({ data, loading }) => {
                        resource = data && data.subscriptionResource ?
                            data.subscriptionResource.node :
                            resource

                        return <ControlGroup>
                            <Mutation
                                mutation={mutationResource}
                            >
                                {(mutationResource, {data, loading}) => {
                                    return <ColumnPicker
                                        ownerChangeCallback={(e: string) => {
                                            mutationResource({
                                                variables: {
                                                    id: resource.id,
                                                    data: {
                                                        primaryKeyOwner: e,
                                                        primaryKeyTable: null,
                                                        primaryKeyColumn: null,
                                                    },
                                                }
                                            })
                                        }}
                                        tableChangeCallback={(e: string) => {
                                            mutationResource({
                                                variables: {
                                                    id: resource.id,
                                                    data: {
                                                        primaryKeyTable: e,
                                                        primaryKeyColumn: null,
                                                    },
                                                }
                                            })
                                        }}
                                        columnChangeCallback={(e: string) => {
                                            mutationResource({
                                                variables: {
                                                    id: resource.id,
                                                    data: {
                                                        primaryKeyColumn: e,
                                                    },
                                                }
                                            })
                                        }}
                                        initialColumn={{
                                            owner: resource.primaryKeyOwner,
                                            table: resource.primaryKeyTable,
                                            column: resource.primaryKeyColumn,
                                        }}
                                        databaseSchema={selectedDatabase ? this.props.data.databases.schemaByDatabaseName[selectedDatabase] : {}}
                                        label={'Primary Key'}
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
                    subscription={subscriptionAttribute}
                    variables={{
                        database: selectedDatabase,
                        resource: selectedFhirResource,
                        attribute: selectedFhirAttribute,
                    }}
                >
                    {({ data, loading, error }) => {

                        {/* If data.subscriptionAttribute is available,
                        then it is what we should display since it means
                        an inputColumn was added or deleted. */}
                        attribute = (data && data.subscriptionAttribute) ?
                            data.subscriptionAttribute.node :
                            attribute
                        const inputColumns = (data && data.subscriptionAttribute) ?
                            data.subscriptionAttribute.node.inputColumns :
                            ((attribute && attribute.inputColumns) ? attribute.inputColumns : [])

                        return <div id='input-columns'>
                        <div id='input-column-rows'>
                            {inputColumns.map((inputColumn: any, index: number) => {
                                {/* Each input column will generate a new subscription
                                to the server, so as to make sure the user is always
                                synchronised with information written in the backend. */}
                                return <Subscription
                                    key={index}
                                    subscription={subscriptionInputColumn}
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
                                                mutation={mutationDeleteInputColumn}
                                            >
                                                {(deleteInputColumn, {data, loading}) => {
                                                    return <Button
                                                        icon={'trash'}
                                                        minimal={true}
                                                        onClick={() => {
                                                            deleteInputColumn({
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
                                                        mutation={mutationInputColumn}
                                                    >
                                                        {(changeInputColumnJoin, {data, loading}) => {
                                                            return <div>
                                                                <StringSelect
                                                                    inputItem={column.joinSourceColumn}
                                                                    items={selectedDatabase ?
                                                                    this.props.data.databases.schemaByDatabaseName[selectedDatabase][column.owner][column.table] : []}
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
                                                                <ColumnPicker
                                                                    ownerChangeCallback={(e: string) => {
                                                                        changeInputColumnJoin({
                                                                            variables: {
                                                                                id: column.id,
                                                                                data: {
                                                                                    joinTargetOwner: e,
                                                                                    joinTargetTable: null,
                                                                                    joinTargetColumn: null,
                                                                                },
                                                                            }
                                                                        })
                                                                    }}
                                                                    tableChangeCallback={(e: string) => {
                                                                        changeInputColumnJoin({
                                                                            variables: {
                                                                                id: column.id,
                                                                                data: {
                                                                                    joinTargetTable: e,
                                                                                    joinTargetColumn: null,
                                                                                },
                                                                            }
                                                                        })
                                                                    }}
                                                                    columnChangeCallback={(e: string) => {
                                                                        changeInputColumnJoin({
                                                                            variables: {
                                                                                id: column.id,
                                                                                data: {
                                                                                    joinTargetColumn: e,
                                                                                },
                                                                            }
                                                                        })
                                                                    }}
                                                                    initialColumn={{
                                                                        owner: column.joinTargetOwner,
                                                                        table: column.joinTargetTable,
                                                                        column: column.joinTargetColumn,
                                                                    }}
                                                                    databaseSchema={selectedDatabase ? this.props.data.databases.schemaByDatabaseName[selectedDatabase] : {}}
                                                                />
                                                            </div>
                                                        }}
                                                    </Mutation>
                                                </div>
                                                <div className='input-column-script'>
                                                    <Mutation
                                                        mutation={mutationInputColumn}
                                                    >
                                                        {(changeInputColumnScript, {data, loading}) => {
                                                            return <StringSelect
                                                                disabled={true}
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
                                mutation={mutationAttribute}
                            >
                                {(mutationAttribute, {data, loading}) => {
                                    return <StringSelect
                                        disabled={true}
                                        inputItem={(attribute && attribute.mergingScript) ? attribute.mergingScript : ''}
                                        items={['mergingScript.py']}
                                        loading={loading}
                                        onChange={(e: string) => {
                                            mutationAttribute({
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
                                    owner: e,
                                    table: null,
                                    column: null,
                                }
                            })
                        }}
                        tableChangeCallback={(e: string) => {
                            this.setState({
                                columnPicker: {
                                    ...this.state.columnPicker,
                                    table: e,
                                    colum: null,
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
                        mutation={mutationAttributeNoId}
                    >
                        {(mutationAttribute, { data, loading }) => {
                            return <Button
                                disabled={false}
                                icon={'add'}
                                onClick={() => mutationAttribute({
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

        let fhirResourceTree = <FhirResourceTree
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
                    {
                        selectedDatabase && selectedFhirResource ?
                            <Button
                                icon={'cog'}
                                minimal={!this.state.toggledNavBar}
                                onClick={() => this.setState({
                                    toggledNavBar: !this.state.toggledNavBar,
                                })}
                            /> :
                            null
                    }
                </div>
                {
                    toggledNavBar && selectedDatabase && selectedFhirResource ?
                        <div className='flex-row'>
                            <Card>
                                {primaryKeyComponent}
                            </Card>
                        </div> :
                        null
                }
            </div>

            {
                selectedDatabase && selectedFhirResource ?
                    <div id='main-container'>
                        {
                            selectedFhirAttribute ?
                                <div id='left-part'>
                                    {inputColumnsComponent}
                                    {columnSelectionComponent}
                                </div> :
                                attributeMessage
                        }
                        <div id='right-part'>
                            <div id='fhir-resource-tree'>
                                {fhirResourceTree}
                            </div>
                        </div>
                    </div> :
                    initialMessage
            }
        </div>
    }
}
