import React, { PureComponent } from "react";
import { Link } from "mirrorx";

import { Button } from "antd";
import { withWrapBox } from "Biz/WithWrapBox/WithWrapBox";

class Index extends PureComponent {
  render() {
    const { user } = this.props;

    return (
      <div style={{ margin: "60px 0 0 60px" }}>
        {user.cognitoGroup.includes("WalletAdmin") && (
          <Link to="/withdrawList">
            <Button className="mr20" type="primary">
              Go to Wallet Management
            </Button>
          </Link>
        )}
        {user.cognitoGroup.includes("KycAdmin") && (
          <Link to="/kycList">
            <Button type="primary">Go to KYC Management</Button>
          </Link>
        )}
      </div>
    );
  }
}

export default withWrapBox(Index);
