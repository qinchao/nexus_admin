import React, { PureComponent } from "react";
import { actions, Link } from "mirrorx";
import { formatDistance } from "date-fns";
import { Button, Table, Typography } from "antd";
import { Form, DatePicker, Select, Input } from "antd";
import moment from "moment";

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
      <span>
        {item.status === "WAITING_FOR_MANUAL_APPROVAL" ||
        item.status === "WAITING_FOR_INVESTIGATION" ? (
          <Link
            to={`${routerConfig.operation.withdrawinspection}?userId=${
              item.userId
            }&recordId=${item.recordId}&currency=${item.currency}&inspect=true`}
          >
            <Button className="resetButton" type="primary">
              Inspect
            </Button>
          </Link>
        ) : (
          <Link
            to={`${routerConfig.operation.withdrawinspection}?userId=${
              item.userId
            }&recordId=${item.recordId}&inspect=false`}
          >
            <Button className="resetButton" type="primary">
              Review
            </Button>
          </Link>
        )}
      </span>
    )
  }
];

class Withdraw extends PureComponent {
  constructor(props) {
    super(props);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  handleSearch = e => {
    e.preventDefault();

    this.props.form.validateFields((err, values) => {
      const {
        timeArray,
        fromRecordId,
        toRecordId,
        userId,
        status,
        currency
      } = values;
      let fetchParam = {
        startTime: timeArray[0].valueOf(),
        endTime: timeArray[1].valueOf()
      };

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
        fetchParam.currency = currency.value;
      }
      if (userId) {
        fetchParam.userId = userId;
      }
      if (status !== "All") {
        fetchParam.status = status;
      }
      if (!userId && status === "All") {
        this.props.form.setFieldsValue({
          status: "WAITING_FOR_MANUAL_APPROVAL"
        });
        fetchParam.status = "WAITING_FOR_MANUAL_APPROVAL";
      }

      actions.withdraw.fetchWithdraw(fetchParam);
    });
  };

  handleReset = () => {
    this.props.form.resetFields();
  };

  render() {
    const { loading, list, currencies } = this.props.withdraw;
    const { getFieldDecorator } = this.props.form;

    const startDate = moment().month(moment().month() - 1),
      endDate = moment();

    return (
      <div className="panelBox">
        <Form
          layout="inline"
          onSubmit={this.handleSearch}
          style={{ marginBottom: 15 }}
        >
          <Form.Item label="Date">
            {getFieldDecorator("timeArray", {
              initialValue: [startDate, endDate]
            })(<RangePicker onChange={this.onRangePickerChange} />)}
          </Form.Item>
          <Form.Item label="fromRecordId">
            {getFieldDecorator("fromRecordId")(<Input maxLength={10} />)}
          </Form.Item>
          <Form.Item label="toRecordId">
            {getFieldDecorator("toRecordId")(<Input maxLength={10} />)}
          </Form.Item>
          <Form.Item label="userId">
            {getFieldDecorator("userId")(<Input maxLength={25} />)}
          </Form.Item>
          <Form.Item label="status">
            {getFieldDecorator("status", {
              initialValue: "WAITING_FOR_MANUAL_APPROVAL"
            })(
              <Select style={{ minWidth: "200px" }}>
                <Option value="All">All</Option>
                <Option value="WAITING_FOR_USER_CONFIRMATION">
                  WAITING_FOR_USER_CONFIRMATION
                </Option>
                <Option value="WAITING_FOR_AUDIT">WAITING_FOR_AUDIT</Option>
                <Option value="WAITING_FOR_MANUAL_APPROVAL">
                  WAITING_FOR_MANUAL_APPROVAL
                </Option>
                <Option value="WAITING_FOR_INVESTIGATION">
                  WAITING_FOR_INVESTIGATION
                </Option>
                <Option value="READY_TO_WITHDRAW">READY_TO_WITHDRAW</Option>
                <Option value="DNW_ONGOING">DNW_ONGOING</Option>
                <Option value="DNW_SUCC">DNW_SUCC</Option>
                <Option value="DNW_FAILED">DNW_FAILED</Option>
                <Option value="DNW_EXPIRED">DNW_EXPIRED</Option>
                <Option value="DNW_CANCELED">DNW_CANCELED</Option>
                <Option value="DNW_REJECTED">DNW_REJECTED</Option>
              </Select>
            )}
          </Form.Item>
          <Form.Item label="currency">
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

        <Text strong>Note</Text>
        <br />
        <Text type="secondary">
          1.Without filtering, you are looking at all the withdraw records with
          status: WAITING_FOR_MANUAL_APPROVAL.
        </Text>
        <br />
        <Text type="secondary">
          2.While using the filter, if you didn't specify a userId, you must
          specify a withdraw status; Otherwise, the status will be set to
          WAITING_FOR_MANUAL_APPROVAL by default.
        </Text>
        <br />
        <Text type="secondary">
          3.Except for Date, if you didn't change the values in the boxes, they
          will not be in the filter
        </Text>
        <br />
        <Text type="secondary">
          4.If you input fromRecordId or toRecordId, Date will not be in the
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

const WithdrawList = Form.create({ name: "kyc_search" })(Withdraw);

export default WithdrawList;
