import React, { PureComponent } from "react";
import { actions, Link } from "mirrorx";
import routerConfig from "appSrc/routerConfig";
import { formatDate } from "Utils/index";
import { Button, Table, Form, Input, Dropdown, Menu, Icon } from "antd";
import { ACCOUNT_FUNCTIONS } from "Utils/constant";

function handleMenuClick(item, e) {
  actions.userList.updateUserInList({
    userId: item.userId,
    func: e.key,
    action: item.accountFunctions[ACCOUNT_FUNCTIONS[e.key]]
      ? "DISABLE"
      : "ENABLE"
  });
}

const menu = item => {
  return (
    <Menu onClick={handleMenuClick.bind(this, item)}>
      <Menu.Item key="LOGIN">Login As</Menu.Item>
      {Object.keys(item.accountFunctions).map(key => {
        let text = key[0] + key.substr(1).toLowerCase();
        return (
          <Menu.Item key={key}>
            {item.accountFunctions[key] ? "Disable " + text : "Enable " + text}
          </Menu.Item>
        );
      })}
    </Menu>
  );
};

const columns = [
  {
    title: "User",
    dataIndex: "userId",
    key: "userId",
    render: (text, item) => (
      <Link to={`${routerConfig.user.userInspection}?userId=${item.userId}`}>
        {item.userId}
      </Link>
    )
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email"
  },
  {
    title: "Phone Number",
    dataIndex: "phoneNumber",
    key: "phoneNumber",
    render: (text, item) => <>{item.phoneNumber || "N/A"}</>
  },
  {
    title: "Account Status",
    dataIndex: "accountStatus",
    key: "accountStatus",
    render: (text, item) => {
      return item.accountFunctions[ACCOUNT_FUNCTIONS.USER] ? (
        <div style={{ color: "green" }}> ACTIVATED </div>
      ) : (
        <div style={{ color: "red" }}> DISABLE </div>
      );
    }
  },
  {
    title: "KYC Status",
    dataIndex: "kycStatus",
    key: "kycStatus"
  },
  {
    title: "Exchange Status",
    dataIndex: "exchangeStatus",
    key: "exchangeStatus",
    render: (text, item) => {
      return Object.keys(item.accountFunctions).map(key => {
        if (key === ACCOUNT_FUNCTIONS.USER) return "";
        return (
          <div
            style={
              item.accountFunctions[key] ? { color: "green" } : { color: "red" }
            }
          >
            {key}
          </div>
        );
      });
    }
  },
  {
    title: "Register Date",
    dataIndex: "registerDate",
    key: "registerDate",
    render: (text, item) => <>{formatDate(item.registerDate)}</>
  },
  {
    title: "Action",
    key: "action",
    render: (text, item) => (
      <div>
        <Dropdown overlay={menu(item)}>
          <Button>
            Actions <Icon type="down" />
          </Button>
        </Dropdown>
      </div>
    )
  }
];

class User extends PureComponent {
  constructor(props) {
    super(props);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  handleSearch = e => {
    e.preventDefault();

    this.props.form.validateFields((err, values) => {
      const { userId, email } = values;
      let fetchParam = {};
      if (userId) {
        fetchParam.userId = userId;
      }
      if (email) {
        fetchParam.email = email;
      }
      actions.userList.fetchUsers(fetchParam);
    });
  };

  handleReset = () => {
    this.props.form.resetFields();
    actions.userList.fetchUsers();
  };

  render() {
    const { list, loading } = this.props.userList;
    const { getFieldDecorator } = this.props.form;

    return (
      <div className="panelBox">
        <Form
          layout="inline"
          onSubmit={this.handleSearch}
          style={{ marginBottom: 15 }}
        >
          <Form.Item label="userId">
            {getFieldDecorator("userId")(<Input maxLength={10} />)}
          </Form.Item>
          <Form.Item label="email">
            {getFieldDecorator("email")(<Input maxLength={50} />)}
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Search
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
              Reset
            </Button>
          </Form.Item>
        </Form>

        <Table
          style={{ marginTop: 15 }}
          rowKey={item => item.userId}
          columns={columns}
          dataSource={list}
          loading={loading}
        />
      </div>
    );
  }
}

const UserList = Form.create({ name: "user_search" })(User);

export default UserList;
