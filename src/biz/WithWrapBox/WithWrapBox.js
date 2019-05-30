import React, { PureComponent } from "react";
import { actions, NavLink, Link } from "mirrorx";
import { Layout, Menu, Button, Empty } from "antd";

import { getMenuItemData } from "Utils/menu";
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
                {getMenuItemData(user, ["operation", "user", "config"]).map(
                  menuItemData => (
                    <Menu.Item key={menuItemData.key}>
                      <NavLink to={menuItemData.to}>
                        {menuItemData.name}
                      </NavLink>
                    </Menu.Item>
                  )
                )}
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

          {!Object.keys(user.permissions).length ? (
            <Empty
              style={{ height: "calc(100vh - 128px)" }}
              description="Sorry, you don't have the permission to access this page."
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          ) : (
            <WrappedComponent {...this.props} />
          )}
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
