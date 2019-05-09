import React, { PureComponent } from "react";

import { withWrapBox } from "Biz/WithWrapBox/WithWrapBox";
import Withdraw from "./Withdraw/Withdraw";
import KYC from "./KYC/KYC";

class Operation extends PureComponent {
  render() {
    const { user, operation } = this.props;
    const { navTabCur, list, currencies } = operation;

    let isAdmin = user && user.cognitoGroup;
    let kycPermission = isAdmin && user.cognitoGroup.includes("KycAdmin");
    let withdrawPermission =
      isAdmin && user.cognitoGroup.includes("WalletAdmin");
    isAdmin = kycPermission || withdrawPermission;
    if (!isAdmin) {
      return (
        <div>{"Sorry, you don't have the permission to access this page."}</div>
      );
    }

    return (
      <>
        {navTabCur === "withdraw" && (
          <Withdraw
            loading={this.props.operation.loading}
            list={list}
            currencies={currencies}
          />
        )}
        {navTabCur === "kyc" && (
          <KYC loading={this.props.operation.loading} list={list} />
        )}
      </>
    );
  }
}

export default withWrapBox(Operation);
