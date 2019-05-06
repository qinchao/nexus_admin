import React, { PureComponent } from "react";
import { actions } from "mirrorx";

import { withWrapBox } from "Biz/WithWrapBox/WithWrapBox";
import NavTab from "Biz/NavTab/NavTab";
import Withdraw from "./Withdraw/Withdraw";
import KYC from "./KYC/KYC";
import "./Operation.less";

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

    let NavTabItems = [];
    if (withdrawPermission) {
      NavTabItems.push({
        type: "withdraw",
        title: "Withdraw",
        link: "/operation?tab=withdraw"
      });
    }
    if (kycPermission) {
      NavTabItems.push({
        type: "kyc",
        title: "KYC",
        link: "/operation?tab=kyc"
      });
    }

    return (
      <div className="ctBox ordersWrap">
        <NavTab
          NavTabItems={NavTabItems}
          navTabCur={navTabCur}
          clickEvent={actions.operation.changeNavTab}
        />

        <div className="ctContainer panelBox enlarge">
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
        </div>
      </div>
    );
  }
}

export default withWrapBox(Operation);
