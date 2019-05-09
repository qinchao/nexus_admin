import React, { PureComponent } from "react";
import { actions, Link } from "mirrorx";
import { Layout, Menu, Button } from "antd";
import "antd/dist/antd.css";

import logoImgWhite from "Img/logo_medium.svg";
import "./WithWrapBox.less";

const { Header, Content, Sider } = Layout;

function withWrapBox(WrappedComponent) {
  class withWrapBox extends PureComponent {
    render() {
      const { user } = this.props;

      let isAdmin = user && user.cognitoGroup;
      let kycPermission = isAdmin && user.cognitoGroup.includes("KycAdmin");
      let withdrawPermission =
        isAdmin && user.cognitoGroup.includes("WalletAdmin");
      isAdmin = kycPermission || withdrawPermission;
      if (!isAdmin) {
        return (
          <div>Sorry, you don't have the permission to access this page.</div>
        );
      }

      return (
        <Layout>
          <Header className="header">
            <div>
              <div className="logo">
                <Link to="/index">
                  <img src={logoImgWhite} alt="logo" />
                </Link>
              </div>
              <Menu
                theme="dark"
                mode="horizontal"
                defaultSelectedKeys={["1"]}
                style={{ lineHeight: "64px" }}
              >
                <Menu.Item key="1">Operation</Menu.Item>
              </Menu>
            </div>
            <div className="userInfo">
              <div className="mr20">
                Hello, {(user && user.userEmail) || ""}
              </div>
              <Button type="link" onClick={() => actions.user.signOut()}>
                SignOut
              </Button>
            </div>
          </Header>
          <Layout>
            <Sider width={200} style={{ background: "#fff" }}>
              <Menu
                mode="inline"
                defaultSelectedKeys={["1"]}
                style={{ height: "100%", borderRight: 0 }}
              >
                <Menu.Item key="1">
                  <Link to="/withdrawList">Withdrawal</Link>
                </Menu.Item>
                <Menu.Item key="2">
                  <Link to="/kycList">KYC</Link>
                </Menu.Item>
              </Menu>
            </Sider>
            <Layout style={{ padding: "0 24px 24px" }}>
              <Content className="contentWrap">
                <WrappedComponent {...this.props} />
              </Content>
            </Layout>
          </Layout>
        </Layout>
      );
    }
  }

  // Wrap the Display Name for Easy Debugging
  withWrapBox.displayName = `WithSubscription(${getDisplayName(
    WrappedComponent
  )})`;
  return withWrapBox;

  function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || "Component";
  }
}

export { withWrapBox };
