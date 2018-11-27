import * as React from 'react'
import {Route} from 'react-router'
import {
    BrowserRouter,
    Switch,
} from 'react-router-dom'

import MainView from './views/main'
import MimicView from './views/mimic'
import MappingExplorer from './views/mappingExplorer'

const Routes = () => (
    <BrowserRouter>
        <Switch>
            <Route exact path='/' component={MainView} />
            <Route exact path='/explorer' component={MappingExplorer} />
            <Route path='/mimic' component={MimicView} />
        </Switch>
    </BrowserRouter>
)

export default Routes
