import * as React from 'react'
import {Route} from 'react-router'
import {BrowserRouter} from 'react-router-dom'
import {connect} from 'react-redux'

import {
    appState,
    fhirResource,
} from '../types'
import * as actions from '../actions'

import FhirResourceSelect from '../components/fhirResourceSelect'

const mapReduxStateToReactProps = (state : appState): appState => {
    return state
}

function reduxify(mapReduxStateToReactProps: any, mapDispatchToProps?: any, mergeProps?: any, options?: any) {
    return (target: any) => (connect(mapReduxStateToReactProps, mapDispatchToProps, mergeProps, options)(target) as any)
}

@reduxify(mapReduxStateToReactProps)
export class App extends React.Component<appState, any> {
    constructor(props: appState) {
        super(props)
    }

    render () {
        let {currentFhirResource, loading} = this.props

        return (
            <div id='application'>
                <FhirResourceSelect />
            </div>
        )
    }
}
