import React from "react";
import mirror, { render, Router, Switch, Route, Redirect } from "mirrorx";
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

import Index from "Container/Index";
import WithdrawList from "Container/WithdrawList";
import KYCList from "Container/KYCList";
import WithdrawInspection from "Container/WithdrawInspection";
import KYCInspection from "Container/KYCInspection";

mirror.defaults({
  historyMode: "browser"
});

function Routes() {
  return (
    <Router hashType="hashbang">
      <Switch>
        <Route
          exact
          strict
          path="/"
          key="/"
          render={() => <Redirect to="/index" />}
        />
        <Route path="/index" component={Index} />
        <Route path="/withdrawList" component={WithdrawList} />
        <Route path="/withdrawInspection" component={WithdrawInspection} />
        <Route path="/kycList" component={KYCList} />
        <Route path="/kycInspection" component={KYCInspection} />
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
