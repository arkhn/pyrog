import {
    Alignment,
    Button,
    Classes,
    ControlGroup,
    Dialog,
    FormGroup,
    MenuItem,
    Navbar,
    NonIdealState,
    Spinner,
} from '@blueprintjs/core'
import {
    ItemPredicate,
    ItemRenderer,
    Select,
} from '@blueprintjs/select'
import * as React from 'react'
import {Route} from 'react-router'
import {BrowserRouter} from 'react-router-dom'
import {connect} from 'react-redux'

import { graphql } from 'react-apollo'
import { gql } from 'apollo-boost'
// import MatchSummary from './test.graphql'

// Import custom actions
import {
    changeCurrentDatabase,
} from '../actions/currentDatabase'
import {
    changeCurrentFhirResource,
} from '../actions/currentFhirResource'
import {
    changeCurrentFhirAttribute,
} from '../actions/currentFhirAttribute'
import {
    updatePKOwner,
    updatePKTable,
    updatePKColumn,
} from '../actions/mapping'
import {
    fetchInfoNameList,
} from '../actions/nameLists'

// Import custom components
import ColumnPicker from '../components/columnPicker'
import JsonViewer from '../components/jsonViewer'
import FhirResourceTree from '../components/fhirResourceTree'
import InputColumnsTable from '../components/inputColumnsTable'
import StringSelect from '../components/selects/stringSelect'
import TabViewer from '../components/tabViewer'

// Import mock data
import {TEST_JSON} from '../mockdata/testJson'

// Import custom types
import {
    reduxAppState,
} from '../types'

const arkhnLogo = require("../img/arkhn_logo_only_white.svg") as string;

// Redux's state mapping to react props

const mapReduxStateToReactProps = (state : reduxAppState): reduxAppState => {
    return state
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

// Apollo's query result to react props (within redux store)
const mapQueriesToProps = ({data, ownProps} : any) : any => {
    console.log('mapQueriesToProps')
    return {
        graphqlData: data,
    }
}

const graphqlify = (query: any, mapQueriesToProps: any) : any => {
    return (target: any) => (
        graphql<any, any>(
            query,
            {
                props: mapQueriesToProps,
            }
        )(target) as any
    )
}

const MySubscription = gql`
subscription {
  resourceSubscription {
    updatedFields
    node {
      name
    }
  }
}
`

const MyQuery = gql`
query {
    mappings {
        id
        database
        resources {
            id name
        }
    }
}
`

@reduxify(mapReduxStateToReactProps)
@graphqlify(MyQuery, mapQueriesToProps)
export default class MainView extends React.Component<reduxAppState, any> {
    public componentDidMount() {
        this.props.dispatch(fetchInfoNameList())
        // this.subscribeToNewMessages()

        // Auto load state for testing purposes
        // this.props.dispatch(changeCurrentDatabase('CW'))
        // this.props.dispatch(changeCurrentFhirResource('Patient'))
        // this.props.dispatch(changeCurrentFhirAttribute(false, ['name']))
    }

    private subscribeToNewMessages = () : any => {
        this.props.graphqlData.subscribeToMore({
            document: gql`
                subscription {
                  resourceSubscription {
                    updatedFields
                  }
                }
            `,

            /*
            *    Update query specifies how the new data should be merged
            *    with our previous results. Note how the structure of the
            *    object we return here directly matches the structure of
            *    the GetPublicChannels query.
            */
            updateQuery: (prev: any, subscriptionData: any) => {
                console.log('UPDATE QUERY')
                console.log(prev)
                console.log(subscriptionData)

                return {
                    graphqlSubscriptionData: null,
                } as any
            },
        })
    }

    public render () {
        console.log(this.props)
        let {
            currentDatabase,
            currentFhirResource,
            currentFhirAttribute,
            mapping,
        } = this.props

        let {
            databaseNames,
            fhirResources,
            loadingNameLists,
        } = this.props.nameLists

        let {schema} = currentDatabase
        let {dispatch} = this.props

        return (
            <div id='application' className={'bp3-dark'}>
                <Navbar>
                    {loadingNameLists ?
                        <Navbar.Group>
                            <Spinner size={25}/>
                        </Navbar.Group> :
                        <div>
                            <Navbar.Group align={Alignment.LEFT}>
                                <FormGroup
                                    inline={true}
                                    label="Database"
                                    labelFor="text-input"
                                >
                                    <StringSelect
                                        icon={'database'}
                                        inputItem={currentDatabase.name}
                                        intent={'primary'}
                                        items={Object.keys(databaseNames)}
                                        loading={currentDatabase.loadingSchema}
                                        onChange={changeCurrentDatabase}
                                    />
                                </FormGroup>
                                <Navbar.Divider />
                                <FormGroup
                                    inline={true}
                                    label="FHIR Resource"
                                    labelFor="text-input"
                                >
                                    <StringSelect
                                        icon={'layout-hierarchy'}
                                        inputItem={currentFhirResource.name}
                                        intent={'primary'}
                                        items={Object.keys(fhirResources)}
                                        loading={currentFhirResource.loadingResource}
                                        onChange={changeCurrentFhirResource}
                                    />
                                </FormGroup>
                            </Navbar.Group>
                            <Navbar.Group align={Alignment.RIGHT}>
                                {mapping.content ?
                                    <ColumnPicker
                                        databaseSchema={currentDatabase.schema}
                                        label={'Path to Primary Key'}
                                        onChangeOwner={updatePKOwner}
                                        onChangeTable={updatePKTable}
                                        onChangeColumn={updatePKColumn}
                                        databaseColumn={mapping.content.primaryKeyColumn}
                                    /> :
                                    null
                                }
                            </Navbar.Group>
                        </div>
                    }
                </Navbar>

                <div id='main-container'>
                    {mapping.loading ?
                        <div id='main-container-spinner'>
                            <Spinner />
                        </div> :
                        (mapping.content ?
                            <div id='flex-container'>
                                <div id='left-panel'>
                                    <FhirResourceTree
                                        json={currentFhirResource.json}
                                    />
                                </div>

                                <div id='right-container' className={'bp3-dark'}>
                                    {
                                        currentFhirAttribute.length > 0 ?
                                            <div id='input-columns-container'>
                                                <div id='input-columns-viewer'>
                                                    <InputColumnsTable
                                                        databaseSchema={schema}
                                                        inputColumns={mapping.content.fhirMapping[currentFhirAttribute.join('.')]}
                                                    />
                                                </div>
                                                <div id='column-selector'>
                                                    <TabViewer
                                                        databaseSchema={currentDatabase.schema}
                                                    />
                                                </div>
                                            </div>
                                        : <NonIdealState
                                            description={'Select a FHIR resource attribute by clicking on a node in the left panel.'}
                                            icon={<span dangerouslySetInnerHTML={{__html: arkhnLogo}}/>}
                                            title={'No FHIR attribute selected'}
                                        />
                                    }
                                </div>
                            </div> :
                            <NonIdealState
                                description={'Select an input database schema and a FHIR Resource in the navigation bar to start mapping.'}
                                icon={<span dangerouslySetInnerHTML={{__html: arkhnLogo}}/>}
                                title={'Fhirball'}
                            />
                        )
                    }
                </div>
            </div>
        )
    }
}

// const MainViewWithData = graphqlify(MySubscription, mapQueriesToProps)(MainView)
// export const MainViewWithDataWithState = reduxify(mapReduxStateToReactProps)(MainViewWithData)
