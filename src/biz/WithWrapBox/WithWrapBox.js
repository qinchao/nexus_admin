import React, { PureComponent } from "react";
import { actions, NavLink, Link } from "mirrorx";
import { Layout, Menu, Button, Empty } from "antd";

import routerConfig from "routerConfig";
import { getAdminPermission } from "Utils/";
import logoImgWhite from "Img/logo_medium.svg";
import "./WithWrapBox.less";

const { Header } = Layout;

function withWrapBox(WrappedComponent) {
  class withWrapBox extends PureComponent {
    constructor(props) {
      super(props);
      this.handleClick = this.handleClick.bind(this);
      this.state = {
        nav: props.match.params.menu
      };
    }
    handleClick = e => {
      this.setState({
        nav: e.key
      });
    };
    render() {
      const { user } = this.props;
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
                onClick={this.handleClick}
                selectedKeys={[this.state.nav]}
                style={{ lineHeight: "64px" }}
              >
                <Menu.Item key="operation">
                  <NavLink to={routerConfig.operation.kyclist}>
                    Operation
                  </NavLink>
                </Menu.Item>
                <Menu.Item key="user">User</Menu.Item>
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
          <WrappedComponent {...this.props} />
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
