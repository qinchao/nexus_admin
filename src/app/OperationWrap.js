import React, { PureComponent } from "react";
import { NavLink } from "mirrorx";
import { Layout, Menu, Breadcrumb } from "antd";

import { getMenuItemData } from "Utils/menu";
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
              ["operation.kyc", "operation.withdraw"]
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
            <Breadcrumb.Item href={`/${menu}`}>{menu}</Breadcrumb.Item>
            {thirdMenu ? 
              <Breadcrumb.Item href={`/${menu}/${secMenu}`}> 
                {secMenu}
              </Breadcrumb.Item>
            : 
              <Breadcrumb.Item>
                {secMenu}
              </Breadcrumb.Item>
            }
            {thirdMenu ? <Breadcrumb.Item>{thirdMenu}</Breadcrumb.Item> : ""}
          </Breadcrumb>

          <Content className="contentWrap">
            {secMenu === "kyc" && !thirdMenu && (
              <KYCList {...this.props} />
            )}
            {secMenu === "kyc" && thirdMenu === "inspection" && (
              <KYCInspection {...this.props} />
            )}

            {secMenu === "withdraw" && !thirdMenu && (
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
