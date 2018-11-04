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
import FhirResourceSelect from '../components/selects/fhirResourceSelect'
import FhirResourceTree from '../components/fhirResourceTree'
import InputColumnsTable from '../components/inputColumnsTable'
import InputDatabaseSelect from '../components/selects/inputDatabaseSelect'
import StringSelect from '../components/selects/stringSelect'
import TabViewer from '../components/tabViewer'

// Import custom types
import {
    reduxAppState,
} from '../types'

const arkhnLogo = require("../img/arkhn_logo_only_white.svg") as string;

const mapReduxStateToReactProps = (state : reduxAppState): reduxAppState => {
    return state
}

function reduxify(mapReduxStateToReactProps: any, mapDispatchToProps?: any, mergeProps?: any, options?: any) {
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
export class MainView extends React.Component<reduxAppState, any> {
    public componentDidMount() {
        this.props.dispatch(fetchInfoNameList())

        // Auto load state for testing purposes
        this.props.dispatch(changeCurrentDatabase('CW'))
        this.props.dispatch(changeCurrentFhirResource('Patient'))
        // this.props.dispatch(changeCurrentFhirAttribute(false, ['name']))
    }

    public render () {
        let {
            currentDatabase,
            currentFhirResource,
            currentFhirAttribute,
            mapping,
        } = this.props

        let {
            loadingNameLists,
            databaseNameList,
            fhirResourceNameList,
        } = this.props.nameLists

        let {schema} = currentDatabase
        let {dispatch} = this.props

        return (
            <div id='application' className={'bp3-dark'}>
                <Navbar>
                    {loadingNameLists ?
                        <Navbar.Group align={Alignment.CENTER}>
                            <Spinner size={25}/>
                        </Navbar.Group> :
                        <div>
                            <Navbar.Group align={Alignment.LEFT}>
                                <FormGroup
                                    label="Database"
                                    labelFor="text-input"
                                    inline={true}
                                >
                                    <StringSelect
                                        inputItem={currentDatabase.name}
                                        items={databaseNameList}
                                        icon={'database'}
                                        onChange={changeCurrentDatabase}
                                        dispatch={dispatch}
                                        intent={'primary'}
                                    />
                                </FormGroup>
                                <Navbar.Divider />
                                <FormGroup
                                    label="FHIR Resource"
                                    labelFor="text-input"
                                    inline={true}
                                >
                                    <StringSelect
                                        inputItem={currentFhirResource.name}
                                        items={fhirResourceNameList}
                                        icon={'layout-hierarchy'}
                                        onChange={changeCurrentFhirResource}
                                        dispatch={dispatch}
                                        intent={'primary'}
                                    />
                                </FormGroup>
                            </Navbar.Group>
                            <Navbar.Group align={Alignment.RIGHT}>
                                <ControlGroup>
                                    <Button
                                        icon={'cloud-download'}
                                    />
                                    <Button
                                        icon={'cloud-upload'}
                                    />
                                </ControlGroup>
                                <FormGroup >
                                </FormGroup>
                                {/* <Dialog isOpen={true}>
                                    <div className={Classes.DIALOG_BODY}>
                                        <JsonViewer json={this.TEST_JSON}/>
                                    </div>
                                </Dialog> */}
                            </Navbar.Group>
                        </div>
                    }
                </Navbar>

                <div id='main-container'>
                    {mapping.loading ?
                        <Spinner /> :
                        (mapping ?
                            <div id='flex-container'>
                                <div id='left-panel'>
                                    <FhirResourceTree
                                        json={currentFhirResource.json}
                                        dispatch={dispatch}
                                    />
                                </div>

                                <div id='right-container' className={'bp3-dark'}>
                                    {
                                        currentFhirAttribute.length > 0 ?
                                            <div id='input-columns-container'>
                                                <div id='path-to-pk-viewer'>
                                                    <ColumnPicker
                                                        onChangeOwner={updatePKOwner}
                                                        onChangeTable={updatePKTable}
                                                        onChangeColumn={updatePKColumn}
                                                        databaseColumn={mapping.content.primaryKeyColumn}
                                                        databaseSchema={currentDatabase.schema}
                                                        dispatch={dispatch}
                                                        label={'Path to Primary Key'}
                                                    />
                                                </div>
                                                <div id='input-columns-viewer'>
                                                    <InputColumnsTable
                                                        spec={mapping.content.fhirMapping[currentFhirAttribute.join('.')]}
                                                        databaseSchema={schema}
                                                        dispatch={dispatch}
                                                    />
                                                </div>
                                                <div id='column-selector'>
                                                    <TabViewer
                                                        databaseSchema={currentDatabase.schema}
                                                        dispatch={dispatch}
                                                    />
                                                </div>
                                            </div>
                                        : <NonIdealState
                                            icon={<span dangerouslySetInnerHTML={{__html: arkhnLogo}}/>}
                                            title={'No FHIR attribute selected'}
                                            description={'Select a FHIR resource attribute by clicking on a node in the left panel.'}
                                        />
                                    }
                                </div>
                            </div> :
                            <NonIdealState
                                icon={<span dangerouslySetInnerHTML={{__html: arkhnLogo}}/>}
                                title={'Fhirball'}
                                description={'Select an input database schema and a FHIR Resource in the navigation bar to start mapping.'}
                            />
                        )
                    }
                </div>
            </div>
        )
    }
}
