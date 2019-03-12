import * as React from 'react'
import {Route} from 'react-router'
import {
    BrowserRouter,
    Switch,
} from 'react-router-dom'

import Authentication from './containers/views/authentication'
import MappingExplorer from './containers/views/mappingExplorer'
import MimicView from './containers/views/mimic'
import Softwares from './containers/views/softwares'

const Routes = () => (
    <BrowserRouter>
        <Switch>
            <Route exact path='/' component={Authentication} />
            <Route path='/softwares' component={Softwares} />
            <Route path='/mapping' component={MappingExplorer} />
            <Route path='/mimic' component={MimicView} />
        </Switch>
    </BrowserRouter>
)

export default Routes
