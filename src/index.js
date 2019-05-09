import React from "react";
import mirror, { render, Router, Switch, Route } from "mirrorx";
import {
  withAuthenticator,
  SignIn,
  ConfirmSignIn,
  VerifyContact,
  ForgotPassword,
  RequireNewPassword
} from "aws-amplify-react";
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
        <Route path="/withdrawInspection" component={WithdrawInspection} />
        <Route path="/kycInspection" component={KYCInspection} />
        <Route path="/login" component={Login} />
      </Switch>
    </Router>
  );
}

const App = withAuthenticator(Routes, false, [
  <SignIn />,
  <ConfirmSignIn />,
  <VerifyContact />,
  <ForgotPassword />,
  <RequireNewPassword />
]);
render(<App />, document.getElementById("root"));
