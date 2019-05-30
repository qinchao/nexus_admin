import React, { PureComponent } from "react";
import { actions, Link } from "mirrorx";
import { formatDistance } from "date-fns";
import {
  Button,
  Table,
  Typography,
  Form,
  DatePicker,
  Select,
  Input,
  notification
} from "antd";

import routerConfig from "appSrc/routerConfig";
import { getTimeColor, formatDate } from "Utils/index";

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
    title: "Status",
    dataIndex: "kycStatus",
    key: "kycStatus"
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
    title: "Inspector",
    dataIndex: "inspector",
    key: "inspector",
    render: (text, item) => <>{item.inspector || "N/A"}</>
  },
  {
    title: "Inspect Time",
    dataIndex: "inspectTime",
    key: "inspectTime",
    render: (text, item) => (
      <span>{item.inspectTime ? formatDate(item.inspectTime) : "N/A"}</span>
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
        {item.kycStatus === "PENDING_FOR_REVIEW" ? (
          <Link
            to={`${routerConfig.operation.kycInspection}?userId=${
              item.userId
            }&createTime=${item.createTime}&inspect=true`}
          >
            <Button size="small" type="primary">
              Inspect
            </Button>
          </Link>
        ) : (
          <Link
            to={`${routerConfig.operation.kycInspection}?userId=${
              item.userId
            }&createTime=${item.createTime}&inspect=false`}
          >
            <Button size="small" type="primary">
              Review
            </Button>
          </Link>
        )}
      </span>
    )
  }
];

class KYC extends PureComponent {
  constructor(props) {
    super(props);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  handleSearch = e => {
    e.preventDefault();

    this.props.form.validateFields((err, values) => {
      const { timeArray, userId, status } = values;
      let fetchParam = {};
      if(timeArray){
        fetchParam = {
          startTime: timeArray[0].valueOf(),
          endTime: timeArray[1].valueOf()
        };
      }
      if (userId) {
        fetchParam.userId = userId;
      }
      if (status !== "All") {
        fetchParam.status = status;
      }
      if (!userId && status === "All") {
        this.props.form.setFieldsValue({
          status: "PENDING_FOR_REVIEW"
        });
        notification.open({
          message: "Reset the status to PENDING_FOR_REVIEW",
          description: "Please set the userId if you want to search All status.",
          style: {
            width: 600,
            marginLeft: 335 - 600,
          },
        });
        fetchParam.status = "PENDING_FOR_REVIEW";
      }
      actions.kyc.fetchKyc(fetchParam);
    });
  };

  handleReset = () => {
    this.props.form.resetFields();
  };

  render() {
    const { list, loading } = this.props.kyc;
    const { getFieldDecorator } = this.props.form;

    return (
      <div className="panelBox">
        <Form
          layout="inline"
          onSubmit={this.handleSearch}
          style={{ marginBottom: 15 }}
        >
          <Form.Item label="Date">
            {getFieldDecorator("timeArray")(<RangePicker onChange={this.onRangePickerChange} />)}
          </Form.Item>
          <Form.Item label="UserId">
            {getFieldDecorator("userId")(<Input maxLength={10} />)}
          </Form.Item>
          <Form.Item label="Status">
            {getFieldDecorator("status", {
              initialValue: "PENDING_FOR_REVIEW"
            })(
              <Select style={{ width: "200px" }}>
                <Option value="All">All</Option>
                <Option value="PENDING_FOR_REVIEW">PENDING_FOR_REVIEW</Option>
                <Option value="DENIED">DENIED</Option>
                <Option value="APPROVED">APPROVED</Option>
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
          status: PENDING_FOR_REVIEW.
        </Text>
        <br />
        <Text type="secondary">
          2.While using the filter, you have to specifiy a userId or kyc status;
          Otherwise, the status will be set to PENDING_FOR_REVIEW by default.
        </Text>

        <Table
          style={{ marginTop: 15 }}
          rowKey={item => item.userId + item.createTime}
          columns={columns}
          dataSource={list}
          loading={loading}
        />
      </div>
    );
  }
}

const KYCList = Form.create({ name: "kyc_search" })(KYC);

export default KYCList;
