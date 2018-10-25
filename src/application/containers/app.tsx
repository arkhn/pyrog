import * as React from 'react'
import {Route} from 'react-router'
import {BrowserRouter} from 'react-router-dom'
import {connect} from 'react-redux'

import {Navbar, Button, Alignment, ControlGroup, FormGroup} from '@blueprintjs/core'

import {
    appState,
    IFhirResource,
    IDatabase,
} from '../types'
import * as actions from '../actions'

import FhirResourceSelect from '../components/fhirResourceSelect'
import FhirResourceTree from '../components/fhirResourceTree'
import InputDatabaseSelect from '../components/inputDatabaseSelect'

import {fhirResources, inputDatabases} from '../mockdata/mockData';

const mapReduxStateToReactProps = (state : appState): appState => {
    return state
}

function reduxify(mapReduxStateToReactProps: any, mapDispatchToProps?: any, mergeProps?: any, options?: any) {
    return (target: any) => (connect(mapReduxStateToReactProps, mapDispatchToProps, mergeProps, options)(target) as any)
}

@reduxify(mapReduxStateToReactProps)
export class App extends React.Component<appState, any> {
    public render () {
        let {currentFhirResource, currentInputDatabase, dispatch} = this.props

        return (
            <div id='application'>
                <Navbar className={'bp3-dark'}>
                    <Navbar.Group align={Alignment.LEFT}>
                        <Navbar.Heading>
                            Fhirball
                        </Navbar.Heading>
                        <Navbar.Divider />
                        <FormGroup
                            label="Database"
                            labelFor="text-input"
                            inline={true}
                        >
                            <InputDatabaseSelect
                                inputDatabase={currentInputDatabase}
                                items={inputDatabases}
                                dispatch={dispatch}
                            />
                        </FormGroup>
                        <Navbar.Divider />
                        <FormGroup
                            label="FHIR Resource"
                            labelFor="text-input"
                            inline={true}
                        >
                            <FhirResourceSelect
                                resource={currentFhirResource}
                                items={fhirResources}
                                dispatch={dispatch}
                            />
                        </FormGroup>
                    </Navbar.Group>
                </Navbar>

                <div id='left-panel'>
                    <FhirResourceTree
                        nodes={currentFhirResource ? currentFhirResource.content : null}
                        dispatch={dispatch}
                    />
                </div>
            </div>
        )
    }
}
