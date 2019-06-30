import React, { PureComponent } from "react";
import {Form, Select, Table, DatePicker, Button, notification} from "antd";
import { actions } from "mirrorx";
import { truncateToDate } from "Utils/index";
import moment from "moment-timezone";

const { Option } = Select;
const { RangePicker } = DatePicker;

const dateFormat = "MM/DD/YYYY";

const columns = [
  {
    title: "Date",
    key: "date",
    render: row => {
      return (
        <p>
          {moment
            .unix(row.startTime)
            .format("MM/DD/YYYY HH:MM")}
        </p>
      );
    },
    defaultSortOrder: "descend",
    sorter: (a, b) => a.startTime - b.startTime,
  },
  {
    title: "Count",
    key: "count",
    render: row => {
      return <p>{row.totalInBTC.tradeCount}</p>;
    },
    sorter: (a, b) => a.totalInBTC.tradeCount - b.totalInBTC.tradeCount
  },
  {
    title: "Amount In BTC",
    key: "amount",
    render: row => {
      return <p>{row.totalInBTC.tradeAmount}</p>;
    },
    sorter: (a, b) => a.totalInBTC.tradeAmount - b.totalInBTC.tradeAmount
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

const timeZones = [
  'UTC',
  'America/Los_Angeles',
  'Asia/Shanghai',
];

class TradingStatistics extends PureComponent {
  constructor(props) {
    moment.tz.setDefault("UTC");
    super(props);
  }

  handleSearch = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) {
        return
      }
      const { dateRange, timeZone} = values;
      moment.tz.setDefault(timeZone);
      // if user pick 2019/06/10, then
      // dateRange[0] = 2019/06/10 12:34:13
      // startTime    = 2019/06/10 00:00:00Z0 if timezone == utc
      // startTime    = 2019/06/09 16:00:00Z0 if timezone == +8
      let startTime = moment.tz(dateRange[0].format(dateFormat), dateFormat, timeZone);
      let endTime = moment.tz(dateRange[1].format(dateFormat), dateFormat, timeZone).add(1, 'd');
      actions.tradingStatistics.fetchTradingData({
        startTime,
        endTime,
        timeZone,
      });
    });
  };

  handleReset = () => {
    this.props.form.resetFields();
  };

  render() {
    const { loading, tradingData } = this.props.tradingStatistics;
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Form
          layout="inline"
          onSubmit={this.handleSearch}
          style={{ marginBottom: 15 }}
        >
          <Form.Item label="Date">
            {getFieldDecorator("dateRange", {
              rules: [
                { required: true, message: 'Please choose date range!' }
              ]
            })(
              <RangePicker format={dateFormat} />
            )}
          </Form.Item>
          <Form.Item label="TimeZone">
            {getFieldDecorator("timeZone", {
              initialValue: "UTC"
            })(
              <Select style={{ width: 300 }}>
                {timeZones.map( tz =>
                  <Option key={tz}>
                    {tz}
                  </Option>
                )}
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
        <Table
          style={{ marginTop: 30 }}
          rowKey={item => item.startTime}
          columns={columns}
          loading={loading}
          dataSource={tradingData}
          expandedRowRender={record => {
            if (
              record.hasOwnProperty("volumeByQuoteCurrency") &&
              Object.keys(record.volumeByQuoteCurrency).length !== 0
            ) {
              let list = [];
              for (const currency in record.volumeByQuoteCurrency) {
                if (record.volumeByQuoteCurrency.hasOwnProperty(currency)) {
                  list.push({
                    currency: currency,
                    amount: record.volumeByQuoteCurrency[currency].tradeAmount,
                    count: record.volumeByQuoteCurrency[currency].tradeCount
                  });
                }
              }
              return (
                <Table
                  dataSource={list}
                  rowKey={item => item.currency}
                  columns={columnsExpanded}
                  pagination={false}
                />
              );
            }
            return <p>No detail</p>;
          }}
        />
      </div>
    );
  }
}

const TradingStatisticsForm = Form.create({ name: "trading_statistics" })(
  TradingStatistics
);

export default TradingStatisticsForm;
