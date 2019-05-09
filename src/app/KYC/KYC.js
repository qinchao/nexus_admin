import React, { PureComponent } from "react";
import { actions, NavLink } from "mirrorx";
import { formatDistance } from "date-fns";
import { Button, Table, Typography } from "antd";
import { Form, DatePicker, Select, Input } from "antd";
import moment from "moment";

import { getTimeColor, formatDate } from "Utils/index";
import { withWrapBox } from "Biz/WithWrapBox/WithWrapBox";

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
    actions.kyc.fetchKyc(fetchParam);
  };

  onRangePickerChange(date, dateString) {
    console.log(date, dateString);
  }

  handleSearch = e => {
    e.preventDefault();

    this.props.form.validateFields((err, values) => {
      const { timeArray, userId, status } = values;
      let fetchParam = {
        startTime: timeArray[0].valueOf(),
        endTime: timeArray[1].valueOf()
      };
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
        fetchParam.status = "PENDING_FOR_REVIEW";
      }
      actions.kyc.fetchKyc(fetchParam);
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
    const { list, loading } = this.props.kyc;
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
              <NavLink
                to={`/kycInspection?userId=${item.userId}&createTime=${
                  item.createTime
                }&inspect=true`}
                target="_blank"
                activeClassName="selected"
              >
                <Button size="small" type="primary">
                  Inspect
                </Button>
              </NavLink>
            ) : (
              <NavLink
                to={`/kycInspection?userId=${item.userId}&createTime=${
                  item.createTime
                }&inspect=false`}
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

    const startDate = moment().month(moment().month() - 1),
      endDate = moment();

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
            {getFieldDecorator("timeArray", {
              initialValue: [startDate, endDate]
            })(<RangePicker onChange={this.onRangePickerChange} />)}
          </Form.Item>
          <Form.Item label="userId">
            {getFieldDecorator("userId")(<Input maxLength={25} />)}
          </Form.Item>
          <Form.Item label="status">
            {getFieldDecorator("status", { initialValue: "All" })(
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

export default withWrapBox(WrappedKYC);
