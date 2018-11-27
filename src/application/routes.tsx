import * as React from 'react'
import {Route} from 'react-router'
import {
    BrowserRouter,
    Switch,
} from 'react-router-dom'

import MappingExplorer from './views/mappingExplorer'
import MimicView from './views/mimic'

const Routes = () => (
    <BrowserRouter>
        <Switch>
            <Route exact path='/explorer' component={MappingExplorer} />
            <Route path='/mimic' component={MimicView} />
        </Switch>
    </BrowserRouter>
)

export default Routes
