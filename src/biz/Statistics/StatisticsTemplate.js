import React, {PureComponent} from "react";
import moment from "moment-timezone";
import { Form, Select, Table, DatePicker, Button } from "antd";

const { Option } = Select;
const { RangePicker } = DatePicker;
const dateFormat = "MM/DD/YYYY";
const timeZones = ["UTC", "America/Los_Angeles", "Asia/Shanghai"];
const columns = [
  {
    title: "Date",
    key: "date",
    render: row => {
      return <p>{moment.unix(row.startTime).format("MM/DD/YYYY HH:MM")} UTC</p>;
    },
    defaultSortOrder: "descend",
    sorter: (a, b) => a.startTime - b.startTime
  },
  {
    title: "Count",
    key: "count",
    render: row => {
      return <p>{row.count}</p>;
    },
    sorter: (a, b) => a.count - b.count
  },
  {
    title: "Amount In BTC",
    key: "amount",
    render: row => {
      return <p>{row.amount}</p>;
    },
    sorter: (a, b) => a.amount - b.amount
  }
];

const columnsExpanded = [
  {
    title: "Currency",
    key: "currency",
    dataIndex: "currency"
  },
  {
    title: "Count",
    key: "count",
    dataIndex: "count"
  },
  {
    title: "Amount",
    key: "amount",
    dataIndex: "amount"
  }
];

class StatisticsTemplate extends PureComponent {

  handleSearch = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) {
        return;
      }
      const { dateRange, timeZone } = values;
      this.fetchFunction ({
        startDateStr: dateRange[0].format(dateFormat),
        endDateStr: dateRange[1].format(dateFormat),
        timeZone,
      });
    });
  };

  handleReset = () => {
    this.props.form.resetFields();
  };

  formTemplate = () => {
    const { getFieldDecorator } = this.props.form;
    return(
      <Form
        layout="inline"
        onSubmit={this.handleSearch}
        style={{ marginBottom: 15 }}
      >
        <Form.Item label="Date">
          {getFieldDecorator("dateRange", {
            rules: [{ required: true, message: "Please choose date range!" }]
          })(<RangePicker format={dateFormat} />)}
        </Form.Item>
        <Form.Item label="TimeZone">
          {getFieldDecorator("timeZone", {
            initialValue: "UTC"
          })(
            <Select style={{ width: 300 }}>
              {timeZones.map(tz => (
                <Option key={tz}>{tz}</Option>
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
    )
  };

  tableTemplate = (loading, isDnw, data) => {
    return(
      <Table
        style={{ marginTop: 30 }}
        rowKey={item => item.startTime}
        columns={columns}
        loading={loading}
        dataSource={data}
        expandedRowRender={record => {
          if (
            record.hasOwnProperty("detail") &&
            record.detail.length !== 0
          ) {
            return (
              <Table
                dataSource={record.detail}
                rowKey={item => item.currency}
                columns={columnsExpanded}
                pagination={false}
              />
            );
          }
          return <p>No detail</p>;
        }}
      />
    )
  }
}

export {StatisticsTemplate}
