import React, { PureComponent } from "react";
import { NavLink } from "mirrorx";
import { Layout, Menu, Breadcrumb } from "antd";

import { getMenuItemData } from "Utils/menu";
import routerConfig from "appSrc/routerConfig";
import { withWrapBox } from "Biz/WithWrapBox/WithWrapBox";

import TradingStatistics from "Container/TradingStatistics";
import UserStatistics from "Container/UserStatistics";
import OverallStatistics from "Container/OverallStatistics";
import DepositStatistics from "Container/DepositStatistics";
import WithdrawStatistics from "Container/WithdrawStatistics";

const { Content, Sider } = Layout;

class StatisticsWrap extends PureComponent {
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
            {getMenuItemData(user, [
              "statistics.overall",
              "statistics.trading",
              "statistics.user",
              "statistics.deposit",
              "statistics.withdraw",
            ]).map(menuItemData => (
              <Menu.Item key={menuItemData.key}>
                <NavLink to={menuItemData.to}>{menuItemData.name}</NavLink>
              </Menu.Item>
            ))}
          </Menu>
        </Sider>
        <Layout style={{ padding: "24px" }}>
          <Breadcrumb separator=">" style={{ marginBottom: "15px" }}>
            <Breadcrumb.Item href={routerConfig.index}>Home</Breadcrumb.Item>
            <Breadcrumb.Item href={routerConfig[menu]["root"]}>
              {menu}
            </Breadcrumb.Item>
            <Breadcrumb.Item>{secMenu}</Breadcrumb.Item>
          </Breadcrumb>

          <Content className="contentWrap">
            {secMenu === "overall" && <OverallStatistics {...this.props} />}
            {secMenu === "trading" && <TradingStatistics {...this.props} />}
            {secMenu === "user" && <UserStatistics {...this.props} />}
            {secMenu === "deposit" && <DepositStatistics {...this.props} />}
            {secMenu === "withdraw" && <WithdrawStatistics {...this.props} />}
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default withWrapBox(StatisticsWrap);
