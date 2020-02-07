import * as React from 'react';
import { Route } from 'react-router';
import { BrowserRouter, Switch } from 'react-router-dom';

import Authentication from './components/authentication';
import Mapping from './components/mapping';
import NewSource from './components/newSource';
import Sources from './components/sources';
import Fhirpipe from './components/fhirpipe';
import PrivateRoute from './components/privateRoute';

const Routes = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/login" component={Authentication} />
      <PrivateRoute exact path="/" component={Sources} />
      <PrivateRoute exact path="/mapping" component={Mapping} />
      <PrivateRoute exact path="/newSource" component={NewSource} />
      <PrivateRoute exact path="/fhirpipe" component={Fhirpipe} />
    </Switch>
  </BrowserRouter>
);

export default Routes;
