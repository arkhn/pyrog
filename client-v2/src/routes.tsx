import * as React from "react";
import { Route } from "react-router";
import { BrowserRouter, Switch } from "react-router-dom";

import Authentication from "./views/authentication";
import Mapping from "./views/Mapping";
import MimicView from "./views/mimic";
import NewSource from "./views/newSource";
import Sources from "./views/sources";

const Routes = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={Authentication} />
      <Route path="/signin" component={Authentication} />
      <Route path="/mapping" component={Mapping} />
      <Route path="/mimic" component={MimicView} />
      <Route path="/newSource" component={NewSource} />
      <Route path="/sources" component={Sources} />
    </Switch>
  </BrowserRouter>
);

export default Routes;
