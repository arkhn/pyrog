import * as React from 'react'
import {Route} from 'react-router'
import {BrowserRouter} from 'react-router-dom'

import MainView from './views/main'

const Routes = () => (
    <BrowserRouter>
        <Route path='/' component={MainView}/>
    </BrowserRouter>
)

export default Routes
