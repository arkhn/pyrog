import * as actions from '../actions';
import * as React from 'react';
import FhirResourceSelect from '../components/selects/fhirResourceSelect';
import FhirResourceTree from '../components/fhirResourceTree';
import InputColumnsTable from '../components/inputColumnsTable';
import InputDatabaseSelect from '../components/selects/inputDatabaseSelect';
import StringSelect from '../components/selects/stringSelect';
import TabViewer from '../components/tabViewer';
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
} from '@blueprintjs/core';

import { BrowserRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { fhirResources, inputDatabases } from '../mockdata/mockData';
import { ItemPredicate, ItemRenderer, Select } from '@blueprintjs/select';
import { JsonViewer } from '../components/jsonViewer';
import { Route } from 'react-router';

import {
    reduxAppState,
} from '../types'

import {
    fetchInfoNameList,
    changeCurrentDatabase,
    changeCurrentFhirResource,
} from '../actions'

const arkhnLogo = require("../img/arkhn_logo_only_white.svg") as string;

const mapReduxStateToReactProps = (state : reduxAppState): reduxAppState => {
    return state
}

function reduxify(mapReduxStateToReactProps: any, mapDispatchToProps?: any, mergeProps?: any, options?: any) {
     return (target: any) => (connect(mapReduxStateToReactProps, mapDispatchToProps, mergeProps, options)(target) as any)
}

@reduxify(mapReduxStateToReactProps)
export class MainView extends React.Component<reduxAppState, any> {
    public componentDidMount() {
        this.props.dispatch(fetchInfoNameList())
    }

    public render () {
        let {
            dispatch,
            currentDatabase,
            currentFhirResource,
            currentFhirAttribute,
            loadingNameLists,
            databaseNameList,
            fhirResourceNameList,
            databaseSchema,
            fhirResourceJson,
            loadingMapping,
            mapping,
        } = this.props

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
                                        inputItem={currentDatabase}
                                        items={databaseNameList}
                                        icon={'database'}
                                        action={changeCurrentDatabase}
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
                                        inputItem={currentFhirResource}
                                        items={fhirResourceNameList}
                                        icon={'layout-hierarchy'}
                                        action={changeCurrentFhirResource}
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
                    {loadingMapping ?
                        <Spinner /> :
                        (mapping ?
                            <div id='flex-container'>
                                <div id='left-panel'>
                                    <FhirResourceTree
                                        json={fhirResourceJson}
                                        dispatch={dispatch}
                                    />
                                </div>

                                <div id='right-container' className={'bp3-dark'}>
                                    {
                                        currentFhirAttribute.length > 0 ?
                                            <div id='input-columns-container'>
                                                <div id='path-to-pk-viewer'>
                                                    {/* <ControlGroup fill={true} vertical={false}>
                                                        <StringSelect
                                                            inputItem={mapping.pathToPrimaryKey.owner}
                                                            items={currentOwnerList}
                                                            icon={'group-objects'}
                                                            action={actions.changeCurrentDBOwner}
                                                            dispatch={dispatch}
                                                            intent={'primary'}
                                                        />
                                                        <StringSelect
                                                            inputItem={currentFhirResource.table}
                                                            items={currentTableList}
                                                            icon={'th'}
                                                            action={actions.changeCurrentDBTable}
                                                            dispatch={dispatch}
                                                            intent={'primary'}
                                                        />
                                                        <StringSelect
                                                            inputItem={currentFhirResource.primaryKey}
                                                            items={currentColumnList}
                                                            icon={'column-layout'}
                                                            action={actions.changeCurrentDBPrimaryKey}
                                                            dispatch={dispatch}
                                                            intent={'primary'}
                                                        />
                                                    </ControlGroup> */}
                                                </div>
                                                <div id='input-columns-viewer'>
                                                    {/* <InputColumnsTable
                                                        columns={currentInputColumns}
                                                        currentOwnerList={currentOwnerList}
                                                        currentTableList={currentTableList}
                                                        currentColumnList={currentColumnList}
                                                        dispatch={dispatch}
                                                    /> */}
                                                </div>
                                                <div id='column-selector'>
                                                    <TabViewer
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
                            </div>
                        : <NonIdealState
                            icon={<span dangerouslySetInnerHTML={{__html: arkhnLogo}}/>}
                            title={'Fhirball'}
                            description={'Select an input database schema and a FHIR Resource in the navigation bar to start mapping.'}
                        />)
                    }
                </div>
            </div>
        )
    }
}
