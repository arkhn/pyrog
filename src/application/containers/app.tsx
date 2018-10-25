import * as React from 'react'
import {Route} from 'react-router'
import {BrowserRouter} from 'react-router-dom'
import {connect} from 'react-redux'

import {Navbar, Button, Alignment, ControlGroup, FormGroup, MenuItem} from '@blueprintjs/core'
import {Select, ItemPredicate, ItemRenderer} from "@blueprintjs/select";

import {
    appState,
    IFhirResource,
    IDatabase,
} from '../types'
import * as actions from '../actions'

import FhirResourceSelect from '../components/fhirResourceSelect'
import FhirResourceTree from '../components/fhirResourceTree'
import InputDatabaseSelect from '../components/inputDatabaseSelect'

import TSelect from '../components/TSelect'

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

        const renderDatabase: ItemRenderer<IDatabase> = (resource, {handleClick, modifiers, query}) => {
            return (
                <MenuItem
                    key={resource.name}
                    onClick={handleClick}
                    text={resource.name}
                />
            );
        };

        const filterByName: ItemPredicate<IDatabase> = (query, database) => {
            return `${database.name.toLowerCase()}`.indexOf(query.toLowerCase()) >= 0;
        };

        const displayItem = function(item: IDatabase): string {
            return (item ? item.name : "(No selection)");
        }

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
                            <TSelect<IDatabase>
                                renderItem={renderDatabase}
                                filterItems={filterByName}
                                displayItem={displayItem}
                                inputItem={currentInputDatabase}
                                items={inputDatabases}
                                dispatch={dispatch}
                                action={actions.changeCurrentInputDatabase}
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
