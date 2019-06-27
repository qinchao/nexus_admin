import React, { PureComponent } from "react";
import { actions, Link } from "mirrorx";
import { formatDistance } from "date-fns";
import { Button, Table, Typography } from "antd";
import { Form, DatePicker, Select, Input } from "antd";

import { getTimeColor } from "Utils/index";
import routerConfig from "appSrc/routerConfig";

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Text } = Typography;

const columns = [
  {
    title: "User",
    dataIndex: "userId",
    key: "userId"
  },
  {
    title: "RecordId",
    dataIndex: "recordId",
    key: "recordId"
  },
  {
    title: "Currency",
    dataIndex: "currency",
    key: "currency"
  },
  {
    title: "Amount",
    dataIndex: "amount",
    key: "amount"
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status"
  },
  {
    title: "Time",
    dataIndex: "createTime",
    key: "createTime",
    render: (text, item) => (
      <span
        style={getTimeColor(new Date(item.createTime)) ? { color: "red" } : {}}
      >
        {formatDistance(item.createTime, Date.now(), {
          addSuffix: true
        })}
      </span>
    )
  },
  {
    title: "Message",
    key: "message",
    dataIndex: "message",
    render: (text, item) => (
      <div className="wordBreak" style={{ maxWidth: 300 }}>
        {item.message || "N/A"}
      </div>
    )
  },
  {
    title: "Action",
    key: "action",
    render: (text, item) => (
      <Link
        to={`${routerConfig.operation.depositInspection}?userId=${item.userId}&recordId=${item.recordId}`}
      >
        <Button className="resetButton" type="primary">
          Review
        </Button>
      </Link>
    )
  }
];

class Deposit extends PureComponent {
  constructor(props) {
    super(props);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  handleSearch = e => {
    e.preventDefault();

    this.props.form.validateFields((err, values) => {
      const { timeArray, fromRecordId, toRecordId, userId, currency } = values;

      let fetchParam = {};
      if (timeArray) {
        fetchParam = {
          startTime: timeArray[0].valueOf(),
          endTime: timeArray[1].valueOf()
        };
      }
      if (fromRecordId) {
        fetchParam = {};
        fetchParam.fromRecordId = fromRecordId;
      }
      if (toRecordId) {
        if (!fetchParam.fromRecordId) {
          fetchParam = {};
        }
        fetchParam.toRecordId = toRecordId;
      }

      if (currency !== "All") {
        fetchParam.currency = currency;
      }
      if (userId) {
        fetchParam.userId = userId;
      }
      actions.deposit.fetchDeposit(fetchParam);
    });
  };

  handleReset = () => {
    this.props.form.resetFields();
  };

  render() {
    const { loading, list } = this.props.deposit;
    const { currencies } = this.props.withdraw;
    const { getFieldDecorator } = this.props.form;

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
          <Form.Item label="FromRecordId">
            {getFieldDecorator("fromRecordId")(<Input maxLength={10} />)}
          </Form.Item>
          <Form.Item label="ToRecordId">
            {getFieldDecorator("toRecordId")(<Input maxLength={10} />)}
          </Form.Item>
          <Form.Item label="UserId">
            {getFieldDecorator("userId")(<Input maxLength={25} />)}
          </Form.Item>
          <Form.Item label="Currency">
            {getFieldDecorator("currency", { initialValue: "All" })(
              <Select style={{ minWidth: "100px" }}>
                {currencies.map(item => (
                  <Option key={item} value={item}>
                    {item}
                  </Option>
                ))}
              </Select>
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

        <Text strong>Note: </Text>
        <Text type="secondary">
          If you input fromRecordId or toRecordId, Date will not be in the
          filer.
        </Text>

        <Table
          style={{ marginTop: 15 }}
          rowKey={item => item.recordId}
          columns={columns}
          dataSource={list}
          loading={loading}
        />
      </div>
    );
  }
}

const DepositList = Form.create({ name: "deposit_search" })(Deposit);

export default DepositList;
