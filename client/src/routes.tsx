import * as React from 'react';
import { Route } from 'react-router';
import { BrowserRouter, Switch } from 'react-router-dom';

import Authentication from './components/authentication';
import Mapping from './components/mapping';
import NewSource from './components/newSource';
import Sources from './components/sources';
import FhirRiver from './components/river';
import PrivateRoute from './components/routes/privateRoute';
import AdminRoute from './components/routes/adminRoute';

const Routes = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/login" component={Authentication} />
      <PrivateRoute exact path="/" component={Sources} />
      <PrivateRoute exact path="/mapping" component={Mapping} />
      <PrivateRoute exact path="/newSource" component={NewSource} />
      <AdminRoute exact path="/fhir-river" component={FhirRiver} />
    </Switch>
  </BrowserRouter>
);

export default Routes;
