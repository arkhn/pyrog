import {gql} from 'apollo-boost'
import {
    Alignment,
    Breadcrumbs,
    IBreadcrumbProps,
    Button,
    Card,
    Code,
    ControlGroup,
    Elevation,
    FormGroup,
    InputGroup,
    MenuItem,
    NonIdealState,
    OverflowList,
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
    updateDatabase,
    updateFhirAttribute,
    updateFhirResource,
} from './actions'

// Import components
import ColumnPicker from '../../components/columnPicker'
import FhirResourceTree from '../../components/fhirResourceTree'
import InputColumnsTable from '../../components/inputColumnsTable'
import StringSelect from '../../components/selects/stringSelect'
import TSelect from '../../components/selects/TSelect'
import DatabaseSelect from '../../components/selects/databaseSelect'
import ResourceSelect from '../../components/selects/resourceSelect'

// Import types
import {
    IReduxStore,
    IView,
} from '../../types'

import './style.less'

// Requests
const allDatabases = require('./graphql/queries/allDatabases.graphql')
const availableResources = require('./graphql/queries/availableResources.graphql')
const inputColumns = require('./graphql/queries/inputColumns.graphql')
const resourceAttributeTree = require('./graphql/queries/resourceAttributeTree.graphql')
// const recAvailableAttributes = require('./graphql/queries/recAvailableAttributes.graphql')

const createInputColumnAndUpdateAttribute = require('./graphql/mutations/createInputColumnAndUpdateAttribute.graphql')
const deleteInputColumnAndUpdateAttribute = require('./graphql/mutations/deleteInputColumnAndUpdateAttribute.graphql')

const attributeSubscription = require('./graphql/subscriptions/attribute.graphql')

const getAttribute = require('./graphql/getAttribute.graphql')
const getResource = require('./graphql/getResource.graphql')
const getTree = require('./graphql/getTree.graphql')
const mutationJoin = require('./graphql/mutationJoin.graphql')
const mutationDeleteInputColumn = require('./graphql/mutationDeleteInputColumn.graphql')
const mutationDeleteJoin = require('./graphql/mutationDeleteJoin.graphql')
const subscriptionAttribute = require('./graphql/subscriptionAttribute.graphql')
const subscriptionInputColumn = require('./graphql/subscriptionInputColumn.graphql')
const subscriptionResource = require('./graphql/subscriptionResource.graphql')
const subscriptionJoin = require('./graphql/subscriptionJoin.graphql')

const mutationAttribute = require('./graphql/mutationAttribute.graphql')
const mutationAttributeNoId = require('./graphql/mutationAttributeNoId.graphql')
const mutationInputColumn = require('./graphql/mutationInputColumn.graphql')
const mutationResource = require('./graphql/mutationResource.graphql')

const arkhnLogoWhite = require("../../img/arkhn_logo_only_white.svg") as string;
const arkhnLogoBlack = require("../../img/arkhn_logo_only_black.svg") as string;

export interface IMappingExplorerState {
    selectedDatabase: {
        id: string,
        name: string,
    },
    selectedFhirResource: {
        id: string,
        name: string,
    },
    selectedFhirAttribute: {
        id: string,
        name: string,
    },
}

interface IState {
    columnPicker: {
        owner: string,
        table: string,
        column: string,
        staticValue: string,
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
                staticValue: '',
            },
            selectedTabId: 'picker',
            toggledNavBar: false,
        }
    }

    public componentDidMount() {
        // this.props.dispatch(updateDatabase('cjpiarhzxmfmu0a611t9zwqgm', 'Crossway'))
        // this.props.dispatch(updateFhirResource('cjpicvbkxusn60a57glvgvc90', 'Patient'))
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
            icon={<div dangerouslySetInnerHTML={{__html: arkhnLogoBlack}}/>}
            title={'Fhirball'}
        />

        const attributeMessage = <NonIdealState
            description={'Please select a Fhir Attribute'}
            icon={<div dangerouslySetInnerHTML={{__html: arkhnLogoBlack}}/>}
            title={'Fhirball'}
        />

        const primaryKeyComponent = <Query
            query={getResource}
            variables={{
                database: selectedDatabase,
                resource: selectedFhirResource.name,
            }}
            skip={!selectedDatabase || !selectedFhirResource.name}
        >
            {({ loading, error, data }) => {
                if (error) {
                    console.log(error)
                }

                let resource = data ? data.getResource : null

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
                                        databaseSchema={selectedDatabase.name ? this.props.data.databases.schemaByDatabaseName[selectedDatabase.name] : {}}
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

        const inputColumnComponent = (attribute: any, column: any) => <div className='input-column'>
            <Mutation
                mutation={deleteInputColumnAndUpdateAttribute}
            >
                {(deleteInputColumn, {data, loading, error}) => {
                    if (error) {
                        console.log(error)
                    }

                    return <Button
                        icon={'trash'}
                        loading={loading}
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
                {
                    column.staticValue ?
                        <div className='input-column-name'>
                            <Tag large={true}>Static</Tag>
                            <Tag intent={'success'} large={true} minimal={true}>{column.staticValue}</Tag>
                        </div> :
                        <div>
                            <div className='input-column-name'>
                                <Breadcrumbs
                                    breadcrumbRenderer={(item: IBreadcrumbProps) => {
                                        return <div>
                                            {item.text}
                                        </div>
                                    }}
                                    items={[
                                        {
                                            text: <div className='stacked-tags'>
                                                <Tag minimal={true}>OWNER</Tag>
                                                <Tag intent={'success'} large={true}>{column.owner}</Tag>
                                            </div>
                                        },
                                        {
                                            text: <div className='stacked-tags'>
                                                <Tag minimal={true}>TABLE</Tag>
                                                <Tag intent={'success'} large={true}>{column.table}</Tag>
                                            </div>
                                        },
                                        {
                                            text: <div className='stacked-tags'>
                                                <Tag minimal={true}>COLUMN</Tag>
                                                <Tag intent={'success'} large={true}>{column.column}</Tag>
                                            </div>
                                        }
                                    ]}
                                />
                                <Mutation
                                    mutation={mutationInputColumn}
                                >
                                    {(changeInputColumnScript, {data, loading}) => {
                                        return <div className='stacked-tags'>
                                            <Tag>SCRIPT</Tag>
                                            <StringSelect
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
                                        </div>
                                    }}
                                </Mutation>
                            </div>
                            <div className='input-column-joins'>
                                <Mutation
                                    mutation={mutationInputColumn}
                                >
                                    {(changeInputColumnJoin, {data, loading}) => {
                                        return <Button
                                            icon={'add'}
                                            onClick={() => {
                                                changeInputColumnJoin({
                                                    variables: {
                                                        id: column.id,
                                                        data: {
                                                            joins: {
                                                                create: [
                                                                    {}
                                                                ]
                                                            }
                                                        },
                                                    },
                                                })
                                            }}
                                        >
                                            Add Join
                                        </Button>
                                    }}
                                </Mutation>
                                {
                                    column.joins ?
                                        column.joins.map((join: any, index: number) => {
                                            let joinData = join
                                            return <Subscription
                                                key={index}
                                                subscription={subscriptionJoin}
                                                variables={{
                                                    id: join.id,
                                                }}
                                            >
                                                {({ data, loading }) => {
                                                    joinData = (data && data.subscribeToJoin) ?
                                                        data.subscribeToJoin.node :
                                                        joinData

                                                    return joinData ?
                                                        joinComponent(joinData, column) :
                                                        null
                                                }}
                                            </Subscription>
                                        }) :
                                        null
                                }
                            </div>
                        </div>
                }
            </Card>
        </div>

        const joinColumnsComponent = (join: any, updateJoin: any) => <div className='join-columns'>
            <ColumnPicker
                ownerChangeCallback={(e: string) => {
                    updateJoin({
                        variables: {
                            id: join.id,
                            data: {
                                sourceOwner: e,
                                sourceTable: null,
                                sourceColumn: null,
                            },
                        }
                    })
                }}
                tableChangeCallback={(e: string) => {
                    updateJoin({
                        variables: {
                            id: join.id,
                            data: {
                                sourceTable: e,
                                sourceColumn: null,
                            },
                        }
                    })
                }}
                columnChangeCallback={(e: string) => {
                    updateJoin({
                        variables: {
                            id: join.id,
                            data: {
                                sourceColumn: e,
                            },
                        }
                    })
                }}
                initialColumn={{
                    owner: join.sourceOwner,
                    table: join.sourceTable,
                    column: join.sourceColumn,
                }}
                databaseSchema={selectedDatabase.name ? this.props.data.databases.schemaByDatabaseName[selectedDatabase.name] : {}}
            />
            <ColumnPicker
                ownerChangeCallback={(e: string) => {
                    updateJoin({
                        variables: {
                            id: join.id,
                            data: {
                                targetOwner: e,
                                targetTable: null,
                                targetColumn: null,
                            },
                        }
                    })
                }}
                tableChangeCallback={(e: string) => {
                    updateJoin({
                        variables: {
                            id: join.id,
                            data: {
                                targetTable: e,
                                targetColumn: null,
                            },
                        }
                    })
                }}
                columnChangeCallback={(e: string) => {
                    updateJoin({
                        variables: {
                            id: join.id,
                            data: {
                                targetColumn: e,
                            },
                        }
                    })
                }}
                initialColumn={{
                    owner: join.targetOwner,
                    table: join.targetTable,
                    column: join.targetColumn,
                }}
                databaseSchema={selectedDatabase.name ? this.props.data.databases.schemaByDatabaseName[selectedDatabase.name] : {}}
            />
        </div>

        const joinComponent = (joinData: any, column: any) => <div className={'join'}>
            <Mutation
                mutation={mutationDeleteJoin}
            >
                {(deleteJoin, {data, loading}) => {
                    return <Button
                        icon={'trash'}
                        minimal={true}
                        onClick={() => {
                            deleteJoin({
                                variables: {
                                    inputColumnId: column.id,
                                    joinId: joinData.id,
                                }
                            })
                        }}
                    />
                }}
            </Mutation>
            <Mutation
                mutation={mutationJoin}
            >
                {(updateJoin, {data, loading}) => {
                    return joinColumnsComponent(joinData, updateJoin)
                }}
            </Mutation>
        </div>

        const inputColumnsComponent = <Query
            query={inputColumns}
            variables={{
                attributeId: selectedFhirAttribute.id,
            }}
            skip={!selectedFhirAttribute.id}
        >
            {({ data, error, loading }) => {
                {/* Before rendering this view, verify that all
                inconsistent usecases are sorted (is the query loading,
                did it trigger an error, did it return data?) */}
                if (loading) {
                    return <Spinner />
                }
                if (error) {
                    console.log(error)
                }

                let inputColumns = (data && data.inputColumns) ? data.inputColumns : []

                return selectedFhirAttribute.id ?
                    <Subscription
                        subscription={attributeSubscription}
                        variables={{
                            id: selectedFhirAttribute.id,
                        }}
                    >
                        {({ data, loading, error }) => {
                            if (error) {
                                console.log(error)
                            }

                            const attribute = (data && data.attribute && data.attribute.node) ?
                                data.attribute.node :
                                null

                            inputColumns = attribute && attribute.inputColumns ?
                                attribute.inputColumns :
                                inputColumns

                            return <div id='input-columns'>
                            <div id='input-column-rows'>
                                {inputColumns.map((inputColumn: any, index: number) => {
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

                                            return column ?
                                                inputColumnComponent(selectedFhirAttribute, column) :
                                                null
                                        }}
                                    </Subscription>
                                })}
                            </div>
                            {
                                inputColumns.length > 1 ?
                                    <div id='input-column-merging-script'>
                                        <Mutation
                                            mutation={mutationAttribute}
                                        >
                                            {(mutationAttribute, {data, loading}) => {
                                                return <div className='stacked-tags'>
                                                    <Tag>SCRIPT</Tag>
                                                    <StringSelect
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
                                                </div>
                                            }}
                                        </Mutation>
                                    </div> :
                                    null
                            }
                        </div>
                    }}
                </Subscription> :
                null
            }}
        </Query>

        const columnPickingTab = <div id={'column-picker'}>
            <Card elevation={Elevation.ONE}>
                <FormGroup
                    label={<h3>Column Picker</h3>}
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
                                        column: null,
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
                            databaseSchema={selectedDatabase.name ? data.databases.schemaByDatabaseName[selectedDatabase.name] : {}}
                        />
                        <Mutation
                            mutation={createInputColumnAndUpdateAttribute}
                        >
                            {(createInputColumnAndUpdateAttribute, { data, loading }) => {
                                return <Button
                                    disabled={!columnPicker.column || !selectedFhirAttribute}
                                    icon={'add'}
                                    loading={loading}
                                    onClick={() => createInputColumnAndUpdateAttribute({
                                        variables: {
                                            attributeId: selectedFhirAttribute.id,
                                            data: {
                                                owner: columnPicker.owner,
                                                table: columnPicker.table,
                                                column: columnPicker.column,
                                            }
                                        }
                                    })}
                                />
                            }}
                        </Mutation>
                    </ControlGroup>
                </FormGroup>
            </Card>
            <Card elevation={Elevation.ONE}>
                <FormGroup
                    label={<h3>Column With Static Value</h3>}
                    labelFor='text-input'
                    inline={true}
                >
                    <ControlGroup>
                        <InputGroup
                            id="static-value-input"
                            onChange={(event: React.FormEvent<HTMLElement>) => {
                                const target = event.target as HTMLInputElement

                                this.setState({
                                    columnPicker: {
                                        ...this.state.columnPicker,
                                        staticValue: target.value,
                                    }
                                })
                            }}
                            placeholder="Column static value"
                            value={columnPicker.staticValue}
                        />
                        <Mutation
                            mutation={mutationAttributeNoId}
                        >
                            {(mutationAttribute, { data, loading }) => {
                                return <Button
                                    disabled={columnPicker.staticValue.length == 0}
                                    icon={'add'}
                                    onClick={() => mutationAttribute({
                                        variables: {
                                            database: selectedDatabase,
                                            resource: selectedFhirResource.name,
                                            attributePath: selectedFhirAttribute,
                                            data: {
                                                inputColumns: {
                                                    create: [
                                                        {
                                                            staticValue: columnPicker.staticValue,
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
            </Card>
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
                <Tab id="picker" title="Simple Tools" panel={columnPickingTab} />
                <Tab id="mb" disabled title="Column Suggestion Tool" panel={columnSuggestionTab} />
            </Tabs>
        </div>

        const fhirResourceTree = <Query
            query={resourceAttributeTree}
            variables={{
                resourceId: selectedFhirResource.id,
            }}
            skip={!selectedDatabase || !selectedFhirResource.id}
        >
            {({ data, loading }) => {
                return loading ?
                    <Spinner /> :
                    <FhirResourceTree
                        json={
                            data.resource.attributes
                        }
                        onClickCallback={(nodeData: any) => {
                            dispatch(updateFhirAttribute(nodeData.id, nodeData.name))
                        }}
                        selectedNodeId={selectedFhirAttribute.id}
                    />
            }}
        </Query>

        return <Query
            query={allDatabases}
        >
            {({ data, loading }) => {
                return <div id='mapping-explorer-container'>
                    <div id='navbar' className={'bp3-dark'}>
                        <div className='flex-row'>
                            <ControlGroup>
                                <DatabaseSelect
                                    icon={'database'}
                                    inputItem={selectedDatabase}
                                    intent={'primary'}
                                    items={data.allDatabases ? data.allDatabases : []}
                                    loading={loading || this.props.data.databases.loadingDatabaseSchema}
                                    onChange={(database: any) => {
                                        dispatch(changeDatabase(database.id, database.name))
                                    }}
                                />
                                <Query
                                    query={availableResources}
                                    variables={{
                                        database: selectedDatabase.name
                                    }}
                                    skip={!selectedDatabase.name}
                                >
                                    {({ data, loading }) => {
                                        return <ResourceSelect
                                            disabled={!selectedDatabase}
                                            icon={'layout-hierarchy'}
                                            inputItem={selectedFhirResource}
                                            intent={'primary'}
                                            items={data && data.availableResources ? data.availableResources : []}
                                            loading={loading}
                                            onChange={(resource: any) => {
                                                dispatch(updateFhirResource(resource.id, resource.name))
                                            }}
                                        />
                                    }}
                                </Query>
                            </ControlGroup>
                            {
                                selectedDatabase && selectedFhirResource.name ?
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
                            toggledNavBar && selectedDatabase && selectedFhirResource.name ?
                                <div className='flex-row'>
                                    <Card>
                                        {primaryKeyComponent}
                                    </Card>
                                </div> :
                                null
                        }
                    </div>

                    {
                        selectedDatabase && selectedFhirResource.name ?
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
            }}
        </Query>
    }
}
