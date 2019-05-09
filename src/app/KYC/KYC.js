import React, { PureComponent } from "react";
import { actions, NavLink } from "mirrorx";
import { formatDistance } from "date-fns";
import { Button, Table, Typography } from "antd";
import { Form, DatePicker, Select, Input } from "antd";

import { getTimeColor, formatDate } from "Utils/index";

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Text } = Typography;

class KYC extends PureComponent {
  constructor(props) {
    super(props);
    this.onRangePickerChange = this.onRangePickerChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  handleKycSearch = fetchParam => {
    actions.operation.fetchKyc(fetchParam);
  };

  onRangePickerChange(date, dateString) {
    console.log(date, dateString);
  }

  handleSearch = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      console.log("Received values of form: ", values);
    });
  };

  handleReset = () => {
    this.props.form.resetFields();
  };

  handleKycReset = () => {
    let fetchParam = { status: "PENDING_FOR_REVIEW" };
    this.handleKycSearch(fetchParam);
  };

  render() {
    const { loading, list } = this.props;
    const { getFieldDecorator } = this.props.form;

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
            style={
              getTimeColor(new Date(item.createTime)) ? { color: "red" } : {}
            }
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
        render: (text, item) => <>{item.message || "N/A"}</>
      },
      {
        title: "Action",
        key: "action",
        render: (text, item) => (
          <span>
            {item.kycStatus === "PENDING_FOR_REVIEW" ? (
              <NavLink
                to={`/operation/kycInspection?userId=${
                  item.userId
                }&createTime=${item.createTime}&inspect=true`}
                target="_blank"
                activeClassName="selected"
              >
                <Button size="small" type="primary">
                  Inspect
                </Button>
              </NavLink>
            ) : (
              <NavLink
                to={`/operation/kycInspection?userId=${
                  item.userId
                }&createTime=${item.createTime}&inspect=false`}
                target="_blank"
                activeClassName="selected"
              >
                <Button size="small" type="primary">
                  Review
                </Button>
              </NavLink>
            )}
          </span>
        )
      }
    ];

    return (
      <div className="panelBox">
        {/* <KycSearchList
          onSearch={this.handleKycSearch}
          onReset={this.handleKycReset}
        /> */}
        <Form
          layout="inline"
          onSubmit={this.handleSearch}
          style={{ marginBottom: 15 }}
        >
          <Form.Item label="Date">
            {getFieldDecorator("range-picker")(
              <RangePicker onChange={this.onRangePickerChange} />
            )}
          </Form.Item>
          <Form.Item label="userId">
            {getFieldDecorator("input")(<Input maxLength={25} />)}
          </Form.Item>
          <Form.Item label="status">
            {getFieldDecorator("select", { initialValue: "All" })(
              <Select>
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

const WrappedKYC = Form.create({ name: "kyc_search" })(KYC);

export default WrappedKYC;
