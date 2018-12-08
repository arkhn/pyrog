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
const getAttribute = require('./queries/getAttribute.graphql')
const getResource = require('./queries/getResource.graphql')
const mutationJoin = require('./queries/mutationJoin.graphql')
const mutationDeleteInputColumn = require('./queries/mutationDeleteInputColumn.graphql')
const mutationDeleteJoin = require('./queries/mutationDeleteJoin.graphql')
const subscriptionAttribute = require('./queries/subscriptionAttribute.graphql')
const subscriptionInputColumn = require('./queries/subscriptionInputColumn.graphql')
const subscriptionResource = require('./queries/subscriptionResource.graphql')
const subscriptionJoin = require('./queries/subscriptionJoin.graphql')

const mutationAttribute = require('./queries/mutationAttribute.graphql')
const mutationAttributeNoId = require('./queries/mutationAttributeNoId.graphql')
const mutationInputColumn = require('./queries/mutationInputColumn.graphql')
const mutationResource = require('./queries/mutationResource.graphql')

const arkhnLogoWhite = require("../../img/arkhn_logo_only_white.svg") as string;
const arkhnLogoBlack = require("../../img/arkhn_logo_only_black.svg") as string;

export interface IMappingExplorerState {
    selectedDatabase: string,
    selectedFhirResource: string,
    selectedFhirAttribute: string[],
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
            {({ loading, error, data }) => {
                console.log(data)
                let resource = data ? data.getResource : null

                console.log(resource)

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
            query={getAttribute}
            variables={{
                database: selectedDatabase,
                resource: selectedFhirResource,
                attributePath: selectedFhirAttribute,
            }}
            skip={!selectedDatabase ||
                !selectedFhirResource ||
                !selectedFhirAttribute ||
                selectedFhirAttribute.length == 0
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

                console.log(`getAttribute ${selectedFhirAttribute}`)
                console.log(data)

                let attribute = (data && data.getAttribute) ? data.getAttribute : null

                return attribute ?
                    <Subscription
                        subscription={subscriptionAttribute}
                        variables={{
                            id: attribute.id
                        }}
                    >
                        {({ data, loading, error }) => {
                            console.log(`Attribute subscription ${attribute.id}`)
                            console.log(data)

                            attribute = (data && data.subscriptionAttribute) ?
                                data.subscriptionAttribute.node :
                                attribute

                            const inputColumns = attribute.inputColumns ?
                                attribute.inputColumns :
                                []

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
                                            console.log(`Input subscription ${inputColumn.id}`)
                                            console.log(data)
                                            const column = (data && data.inputColumnSubscription) ?
                                                data.inputColumnSubscription.node :
                                                inputColumn

                                            return column ? <div className='input-column'>
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
                                                    <div className='input-column-joins'>
                                                        <Mutation
                                                            mutation={mutationInputColumn}
                                                        >
                                                            {(changeInputColumnJoin, {data, loading}) => {
                                                                return <Button
                                                                    icon={'add'}
                                                                    minimal={true}
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
                                                                />
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

                                                                            return join ?
                                                                                <div className={'join'}>
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
                                                                                                            joinId: join.id,
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
                                                                                            return <div className='join-columns'>
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
                                                                                                    databaseSchema={selectedDatabase ? this.props.data.databases.schemaByDatabaseName[selectedDatabase] : {}}
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
                                                                                                    databaseSchema={selectedDatabase ? this.props.data.databases.schemaByDatabaseName[selectedDatabase] : {}}
                                                                                                />
                                                                                            </div>
                                                                                        }}
                                                                                    </Mutation>
                                                                                </div> :
                                                                                null
                                                                        }}
                                                                    </Subscription>
                                                                }) :
                                                                null
                                                        }
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
                </Subscription> :
                null
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
                                        attributePath: selectedFhirAttribute,
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
