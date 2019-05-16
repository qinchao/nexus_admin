import React, { PureComponent } from "react";
import { actions } from "mirrorx";
import { formatDate } from "Utils/index";
import {
  Button,
  Table,
  Form,
  Input,
  Dropdown,
  Menu,
  Icon,
} from "antd";

function handleMenuClick(e) {
  //TODO
}

const menu = (
  <Menu onClick={handleMenuClick}>
    <Menu.Item key="1">Login As</Menu.Item>
    <Menu.Item key="2">Disable User</Menu.Item>
    <Menu.Item key="3">Disable Deposit</Menu.Item>
    <Menu.Item key="4">Disable Withdraw</Menu.Item>
    <Menu.Item key="5">Disable Trade</Menu.Item>
  </Menu>
);

const columns = [
  {
    title: "User",
    dataIndex: "userId",
    key: "userId"
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
  },
  {
    title: "KYC Status",
    dataIndex: "kycStatus",
    key: "kycStatus",
  },
  {
    title: "Exchange Status",
    dataIndex: "exchangeStatus",
    key: "exchangeStatus",
    render: (text, item) => (
      <>
        <div style={item.depositDisabled?{ color: "red" }:{ color: "green" }}>Deposit</div>
        <div style={item.withdrawDisabled?{ color: "red" }:{ color: "green" }}>Withdraw</div>
        <div style={item.tradeDisabled?{ color: "red" }:{ color: "green" }}>Trade</div>
      </>
    )
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
        <Dropdown overlay={menu}>
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
      if (email){
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
