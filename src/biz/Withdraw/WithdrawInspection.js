import React, { PureComponent } from "react";
import { actions } from "mirrorx";
import { Table, Card, Popconfirm } from "antd";
import { Button, Radio, Switch, Select, Input, Row } from "antd";

import { formatDate } from "Utils/index";
import UserProfile from "Components/UserProfile";
import "Biz/Inspection.less";

const Option = Select.Option;
const RadioGroup = Radio.Group;
const { TextArea } = Input;

const LoginColumns = [
  {
    title: "Event",
    dataIndex: "eventType",
    key: "eventType"
  },
  {
    title: "Create Time",
    dataIndex: "createTime",
    key: "createTime",
    render: (text, item) => (
      <>{item.creationDate ? formatDate(new Date(item.creationDate)) : "N/A"}</>
    )
  },
  {
    title: "Response",
    dataIndex: "eventResponse",
    key: "eventResponse"
  },
  {
    title: "Device",
    dataIndex: "deviceName",
    key: "deviceName"
  },
  {
    title: "Ip Address",
    dataIndex: "ipAddress",
    key: "ipAddress"
  },
  {
    title: "City",
    dataIndex: "city",
    key: "city"
  },
  {
    title: "Country or Region",
    dataIndex: "country",
    key: "country"
  }
];
function Login({ loginHistory, loading }) {
  return (
    <Card title="Login History" className="commonWrap loginWrap">
      <Table
        style={{ marginTop: 15 }}
        rowKey="creationDate"
        columns={LoginColumns}
        dataSource={loginHistory}
        loading={loading}
      />
    </Card>
  );
}

const WithdrawHistoryColumns = [
  {
    title: "RecordId",
    dataIndex: "recordId",
    key: "recordId",
    fixed: "left",
    width: 50
  },
  {
    title: "Currency",
    dataIndex: "currency",
    key: "currency",
    fixed: "left",
    width: 80
  },
  {
    title: "Amount",
    dataIndex: "amount",
    key: "amount",
    width: 150
  },
  {
    title: "Source Address",
    dataIndex: "sourceAddress",
    key: "sourceAddress",
    width: 150
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
    width: 150
  },
  {
    title: "Device",
    dataIndex: "device",
    key: "device",
    width: 150
  },
  {
    title: "Ip Address",
    dataIndex: "ipAddress",
    key: "ipAddress",
    width: 150
  },
  {
    title: "Inspector Id",
    dataIndex: "manualReviewerId",
    key: "manualReviewerId",
    width: 150
  },
  {
    title: "Inspect Time",
    dataIndex: "manualReviewTime",
    key: "manualReviewTime",
    width: 150,
    render: (text, item) => (
      <span>
        {item.manualReviewTime ? formatDate(item.manualReviewTime) : "N/A"}
      </span>
    )
  },
  {
    title: "Create Time",
    dataIndex: "createTime",
    key: "createTime",
    width: 150,
    render: (text, item) => (
      <>{item.createTime ? formatDate(item.createTime) : "N/A"}</>
    )
  },
  {
    title: "Update Time",
    dataIndex: "updateTime",
    key: "updateTime",
    width: 150,
    render: (text, item) => (
      <span>{item.updateTime ? formatDate(item.updateTime) : "N/A"}</span>
    )
  },
  {
    title: "Status",
    dataIndex: "status",
    width: 150,
    key: "status"
  },
  {
    title: "Note",
    key: "message",
    dataIndex: "message",
    width: 150,
    render: (text, item) => <>{item.message || "N/A"}</>
  }
];

class WithdrawHistory extends PureComponent{
  state = {
    showAllCurrency: false
  };

  render(){
    const {withdrawHistory, loading, currency, recordId} = this.props;

    return (
      <Card title="Withdraw History" className="commonWrap hisWrap"
        extra={
        <>
          <span>Show All Currencies  </span>
          <Switch
            checked={this.state.showAllCurrency}
            onChange={checked => {
              this.setState({ showAllCurrency: checked });
              if(checked){
                actions.withdrawInspection.initWithdrawHistory();
              }else{
                actions.withdrawInspection.initWithdrawHistory(currency);
              }
            }}
          />
        </>
        }
      >
        <Table
          style={{ marginTop: 15 }}
          rowKey="recordId"
          columns={WithdrawHistoryColumns}
          dataSource={withdrawHistory}
          scroll={{ x: true }}
          loading={loading}
          rowClassName={ (record) => {
            return record.recordId===parseInt(recordId) ? 'light-row': ''}}
        />
      </Card>
    );
  }
}

class InspectResult extends PureComponent {
  state = {
    selectedValue: "",
    message: ""
  };

  onClickSubmit = (action, message) => {
    let params = {
      dnwRecordId: this.props.recordId,
      action: action,
      message: message
    };
    actions.withdraw.withdrawUpdate(params);
    actions.withdrawInspection.updateData({inspect:false});
  };

  handleChange = event => {
    this.setState({ selectedValue: event.target.value });
  };

  handleChangeCurrency = (currency, event) => {
    this.setState({ currency });
  };

  getBalance = (walletBalance, currency) => {
    if (walletBalance.balance && walletBalance.balance[currency]) {
      return `balance: ${walletBalance.balance[currency].balance} ${currency} available: ${
        walletBalance.balance[currency].available
      }`;
    } else {
      return 0;
    }
  };

  render() {
    const { selectedValue, message } = this.state;
    const { walletBalance, currency } = this.props;
    let balance = this.getBalance(walletBalance, currency);

    return (
      <Card title="Inspection Result" className="commonWrap resWrap">
        <Row type="flex" align="middle">{`BALANCE:`}</Row>
        <Row type="flex" align="middle">
          {`We have ${balance}`}
          {balance && (
            <div style={{ paddingLeft: "20px" }}>
              <Select
                value={currency}
                showSearch={true}
                placeholder={currency.label}
                onChange={currency =>
                  actions.withdrawInspection.updateData({ currency })
                }
              >
                {walletBalance.options.map(item => {
                  return <Option key={item}>{item}</Option>;
                })}
              </Select>
            </div>
          )}
        </Row>

        <Row style={{ margin: "15px 0" }}>
          <RadioGroup>
            <Row type="flex" align="top">
              <Radio
                checked={selectedValue === "MANUALLY_APPROVE"}
                value="MANUALLY_APPROVE"
                onChange={this.handleChange}
              >
                Approve
              </Radio>
              <div>
                <Radio
                  checked={selectedValue === "MANUALLY_REJECT"}
                  value="MANUALLY_REJECT"
                  onChange={this.handleChange}
                  style={{ marginBottom: "10px" }}
                >
                  Reject
                </Radio>
                <TextArea
                  value={message}
                  onChange={event => {
                    this.setState({
                      message: event.target.value
                    });
                  }}
                />
              </div>
            </Row>
          </RadioGroup>
        </Row>
        {selectedValue === "" ||
        (selectedValue === "MANUALLY_REJECT" && !message) ? (
          <Button disabled>Submit</Button>
        ) : (
          <Popconfirm
            title={`Are you sure you want submit the ${selectedValue}?`}
            onConfirm={() => this.onClickSubmit(selectedValue, message)}
            okText="Yes"
            cancelText="No"
          >
            <Button>Submit</Button>
          </Popconfirm>
        )}
      </Card>
    );
  }
}

class WithdrawInspection extends PureComponent {
  render() {
    const { withdrawInspection, userInspection } = this.props;
    const {
      curRecordId,
      withdrawHistory,
      inspect,
      walletBalance,
      currency,
      loading
    } = withdrawInspection;
    const {userInfo} = userInspection;

    return (
      <div className="inspectionWrap">
        <UserProfile userInfo={userInfo} loading={loading} />
        <Login loginHistory={userInfo.authHistory} loading={loading} />
        <WithdrawHistory
          recordId={curRecordId}
          withdrawHistory={withdrawHistory}
          currency={currency}
          loading={loading}
        />
        {inspect && (
          <InspectResult
            recordId={curRecordId}
            walletBalance={walletBalance}
            currency={currency}
          />
        )}
      </div>
    );
  }
}

export default WithdrawInspection;
