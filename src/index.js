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

import "./hooks";
import "./base.less";
import "antd/dist/antd.css";

import Index from "Container/Index";
import OperationWrap from "Container/OperationWrap";
import UserWrap from "Container/UserWrap";

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
        <Route path="/index" key="index" component={Index} />
        <Route
          path="/:menu(operation)/:secMenu/:thirdMenu"
          component={OperationWrap}
        />
        <Route
          path="/:menu(operation)/:secMenu"
          component={OperationWrap}
        />
        <Route
          path="/:menu(operation)"
          component={OperationWrap}
        />
        <Route
          path="/:menu(user)/:secMenu"
          component={UserWrap}
        />
        <Route
          path="/:menu(user)"
          component={UserWrap}
        />
        <Route component={Index} />
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
