import * as React from 'react'
import {Route} from 'react-router'
import {
    BrowserRouter,
    Switch,
} from 'react-router-dom'

import MainView from './views/main'
import MimicView from './views/mimic'

const Routes = () => (
    <BrowserRouter>
        <Switch>
            <Route exact path='/' component={MainView} />
            <Route path='/mimic' component={MimicView} />
        </Switch>
    </BrowserRouter>
)

export default Routes
