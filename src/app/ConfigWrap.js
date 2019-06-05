import React, { PureComponent } from "react";
import { NavLink } from "mirrorx";
import { Layout, Menu, Breadcrumb } from "antd";

import { getMenuItemData } from "Utils/menu";
import routerConfig from "appSrc/routerConfig";
import { withWrapBox } from "Biz/WithWrapBox/WithWrapBox";

import GlobalConfig from "Container/GlobalConfig";

const { Content, Sider } = Layout;

class ConfigWrap extends PureComponent {
  render() {
    const { user, match } = this.props;
    const { menu, secMenu } = match.params;

    return (
      <Layout>
        <Sider width={200} style={{ background: "#fff" }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={[secMenu]}
            style={{ height: "100%", borderRight: 0 }}
          >
            {getMenuItemData(
              user,
              ["config.global"]
            ).map(menuItemData => (
              <Menu.Item key={menuItemData.key}>
                <NavLink to={menuItemData.to}>
                  {menuItemData.name}
                </NavLink>
              </Menu.Item>
            ))}
          </Menu>
        </Sider>
        <Layout style={{ padding: "24px" }}>
          <Breadcrumb separator=">" style={{ marginBottom: "15px" }}>
            <Breadcrumb.Item href={routerConfig.index}>Home</Breadcrumb.Item>
            <Breadcrumb.Item href={routerConfig[menu]["root"]}>{menu}</Breadcrumb.Item>
            <Breadcrumb.Item>{secMenu}</Breadcrumb.Item>
          </Breadcrumb>

          <Content className="contentWrap">
            {secMenu === "global" && (
              <GlobalConfig {...this.props} />
            )}
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default withWrapBox(ConfigWrap);
