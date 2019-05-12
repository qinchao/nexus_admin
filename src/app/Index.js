import React, { PureComponent } from "react";
import { Link } from "mirrorx";
import { Button } from "antd";

import { withWrapBox } from "Biz/WithWrapBox/WithWrapBox";
import routerConfig from "appSrc/routerConfig";

class Index extends PureComponent {
  render() {
    const { user } = this.props;

    return (
      <div
        className="welcome"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          minHeight: "calc(100vh - 64px)"
        }}
      >
        <div style={{ fontSize: "20px", marginBottom: "30px" }}>
          Welcome! {(user && user.userEmail) || ""}
        </div>
        <div>
          {user.cognitoGroup.includes("KycAdmin") && (
            <Link to={routerConfig.operation.kyclist}>
              <Button className="mr20" type="primary">
                Go to KYC Management
              </Button>
            </Link>
          )}
          {user.cognitoGroup.includes("WalletAdmin") && (
            <Link to={routerConfig.operation.withdrawlist}>
              <Button type="primary">Go to Wallet Management</Button>
            </Link>
          )}
        </div>
      </div>
    );
  }
}

export default withWrapBox(Index);
