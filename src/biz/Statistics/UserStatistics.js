import React, { PureComponent } from "react";
import { formatDateOnly } from "Utils/index";
import { actions } from "mirrorx";
import { Button, Table, Form, DatePicker } from "antd";
import "Biz/Inspection.less";

const { RangePicker } = DatePicker;

const userStaCol = [
  {
    title: "Time",
    dataIndex: "createTime",
    key: "createTime",
    render: (text, item) => (
      <>{item.createTime ? formatDateOnly(item.createTime * 1000) : "N/A"}</>
    )
  },
  {
    title: "Total Users",
    dataIndex: "totalUsers",
    key: "totalUsers"
  },
  {
    title: "Confirmed Users",
    dataIndex: "confirmedUsers",
    key: "confirmedUsers"
  },
  {
    title: "KYC Passed Users",
    dataIndex: "passKycUsers",
    key: "passKycUsers"
  }
];

class UserStatistics extends PureComponent {
  constructor(props) {
    super(props);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  handleSearch = e => {
    e.preventDefault();

    this.props.form.validateFields((err, values) => {
      const { timeArray } = values;
      let fetchParam = {};
      if (timeArray) {
        fetchParam = {
          startTime: timeArray[0].valueOf(),
          endTime: timeArray[1].valueOf()
        };
      }
      actions.userList.getUserStatistics(fetchParam);
    });
  };

  handleReset = () => {
    this.props.form.resetFields();
  };

  render() {
    const { userList, form } = this.props;
    const { userStatistics, loading } = userList;
    const { getFieldDecorator } = form;

    return (
      <div className="panelBox">
        <Form
          layout="inline"
          onSubmit={this.handleSearch}
          style={{ marginBottom: 15 }}
        >
          <Form.Item label="Date">
            {getFieldDecorator("timeArray")(
              <RangePicker onChange={this.onRangePickerChange} />
            )}
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
          rowKey={item => item.createTime}
          columns={userStaCol}
          dataSource={userStatistics}
          loading={loading}
        />
      </div>
    );
  }
}

const UserSta = Form.create({ name: "userSta_search" })(UserStatistics);

export default UserSta;
