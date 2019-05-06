import React from "react";
import mirror, { render, Router, Switch, Route } from "mirrorx";
import { withAuthenticator } from "aws-amplify-react";
import "./base.less";

import "./hooks";

import Operation from "Container/Operation";
import WithdrawInspection from "Container/WithdrawInspection";
import KYCInspection from "Container/KYCInspection";
import Login from "App/Login/Login";

mirror.defaults({
  historyMode: "browser"
});

function Routes() {
  return (
    <Router hashType="hashbang">
      <Switch>
        <Route path="/operation" component={Operation} />
        <Route path="/login" component={Login} />
        <Route
          path="/operation/withdrawInspection"
          component={WithdrawInspection}
        />
        <Route path="/operation/kycInspection" component={KYCInspection} />
      </Switch>
    </Router>
  );
}

const App = withAuthenticator(Routes);
render(<App />, document.getElementById("root"));
