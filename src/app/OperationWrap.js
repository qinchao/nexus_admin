import React, { PureComponent } from "react";
import { Link } from "mirrorx";
import { Layout, Menu, Empty } from "antd";
import "antd/dist/antd.css";

import { withWrapBox } from "Biz/WithWrapBox/WithWrapBox";
import WithdrawList from "Container/WithdrawList";
import KYCList from "Container/KYCList";
import { getAdminPermission } from "Utils/";
import WithdrawInspection from "Container/WithdrawInspection";
import KYCInspection from "Container/KYCInspection";
const { Content, Sider } = Layout;

class OperationWrap extends PureComponent {
  render() {
    const { user, match } = this.props;

    if (!getAdminPermission(user, ["KycAdmin", "WalletAdmin"])) {
      return (
        <Empty
          style={{ height: "calc(100vh - 128px)" }}
          description="Sorry, you don't have the permission to access this page."
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      );
    }

    return (
      <Layout>
        <Sider width={200} style={{ background: "#fff" }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={["kycList"]}
            style={{ height: "100%", borderRight: 0 }}
          >
            <Menu.Item key="kycList">
              <Link to="/operation/kycList">KYC</Link>
            </Menu.Item>
            <Menu.Item key="withdrawList">
              <Link to="/operation/withdrawList">Withdrawal</Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout style={{ padding: "0 24px 24px" }}>
          <Content className="contentWrap">
            {match.params.subMenu && match.params.subMenu === "kycList" && (
              <KYCList {...this.props} />
            )}
            {match.params.subMenu &&
              match.params.subMenu === "kycInspection" && (
                <KYCInspection {...this.props} />
              )}

            {match.params.subMenu &&
              match.params.subMenu === "withdrawList" && (
                <WithdrawList {...this.props} />
              )}
            {match.params.subMenu &&
              match.params.subMenu === "withdrawInspection" && (
                <WithdrawInspection {...this.props} />
              )}
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default withWrapBox(OperationWrap);
