import * as React from 'react'
import {Route} from 'react-router'
import {BrowserRouter} from 'react-router-dom'
import {connect} from 'react-redux'

import {
    appState,
    IFhirResource,
} from '../types'
import * as actions from '../actions'

import FhirResourceSelect from '../components/fhirResourceSelect'
import FhirResourceTree from '../components/fhirResourceTree'

import {FhirResources} from '../mockData';

const mapReduxStateToReactProps = (state : appState): appState => {
    return state
}

function reduxify(mapReduxStateToReactProps: any, mapDispatchToProps?: any, mergeProps?: any, options?: any) {
    return (target: any) => (connect(mapReduxStateToReactProps, mapDispatchToProps, mergeProps, options)(target) as any)
}

@reduxify(mapReduxStateToReactProps)
export class App extends React.Component<appState, any> {
    public render () {
        let {currentFhirResource, dispatch} = this.props

        return (
            <div id='application'>
                <div id='left-panel'>
                    <FhirResourceSelect
                        resource={currentFhirResource}
                        items={FhirResources}
                        dispatch={dispatch}
                    />
                    <FhirResourceTree
                        nodes={currentFhirResource ? currentFhirResource.content : null}
                        dispatch={dispatch}
                    />
                </div>
            </div>
        )
    }
}
