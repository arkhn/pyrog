import * as React from "react";
import { Route } from "react-router";
import { BrowserRouter, Switch, Redirect } from "react-router-dom";

import Authentication from "./views/authentication";
import Mapping from "./views/mapping";
import NewSource from "./views/newSource";
import Sources from "./views/sources";
import PrivateRoute from "./components/privateRoute";

const Routes = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/login" component={Authentication} />
      <PrivateRoute exact path="/" component={Sources} />
      <PrivateRoute exact path="/mapping" component={Mapping} />
      <PrivateRoute exact path="/newSource" component={NewSource} />
    </Switch>
  </BrowserRouter>
);

export default Routes;
