import React, { PureComponent } from "react";
import { Link } from "mirrorx";
import { Layout, Menu, Empty, Breadcrumb } from "antd";

import { getAdminPermission } from "Utils/";
import routerConfig from "appSrc/routerConfig";
import { withWrapBox } from "Biz/WithWrapBox/WithWrapBox";

import WithdrawList from "Container/WithdrawList";
import KYCList from "Container/KYCList";
import WithdrawInspection from "Container/WithdrawInspection";
import KYCInspection from "Container/KYCInspection";

const { Content, Sider } = Layout;

class OperationWrap extends PureComponent {
  render() {
    const { user, match } = this.props;
    const { menu, secMenu, thirdMenu } = match.params;

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
            defaultSelectedKeys={[secMenu]}
            style={{ height: "100%", borderRight: 0 }}
          >
            <Menu.Item key="kyc">
              <Link to={routerConfig[menu].kyclist}>KYC</Link>
            </Menu.Item>
            <Menu.Item key="withdraw">
              <Link to={routerConfig[menu].withdrawlist}>Withdrawal</Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout style={{ padding: "24px" }}>
          <Breadcrumb separator=">" style={{ marginBottom: "15px" }}>
            <Breadcrumb.Item href={routerConfig.index}>Home</Breadcrumb.Item>
            <Breadcrumb.Item href={routerConfig[menu][secMenu + "list"]}>
              {secMenu}
            </Breadcrumb.Item>
            <Breadcrumb.Item>{thirdMenu}</Breadcrumb.Item>
          </Breadcrumb>

          <Content className="contentWrap">
            {secMenu === "kyc" && thirdMenu === "list" && (
              <KYCList {...this.props} />
            )}
            {secMenu === "kyc" && thirdMenu === "inspection" && (
              <KYCInspection {...this.props} />
            )}

            {secMenu === "withdraw" && thirdMenu === "list" && (
              <WithdrawList {...this.props} />
            )}
            {secMenu === "withdraw" && thirdMenu === "inspection" && (
              <WithdrawInspection {...this.props} />
            )}
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default withWrapBox(OperationWrap);
