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

class WithdrawHistory extends PureComponent {
  state = {
    showAllCurrency: false
  };

  render() {
    const { withdrawHistory, loading, currency, recordId } = this.props;

    return (
      <Card
        title="Withdraw History"
        className="commonWrap hisWrap"
        extra={
          <>
            <span>Show All Currencies </span>
            <Switch
              checked={this.state.showAllCurrency}
              onChange={checked => {
                this.setState({ showAllCurrency: checked });
                if (checked) {
                  actions.withdrawInspection.initWithdrawHistory();
                } else {
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
          rowClassName={record => {
            return record.recordId === parseInt(recordId) ? "light-row" : "";
          }}
        />
      </Card>
    );
  }
}

const AuditColumn = [
  {
    title: "Deposit Amount",
    dataIndex: "depositAmount",
    key: "depositAmount"
  },
  {
    title: "Deposit Count",
    dataIndex: "depositCount",
    key: "depositCount"
  },
  {
    title: "Open Order Reserved Amount",
    dataIndex: "openOrderReservedAmount",
    key: "openOrderReservedAmount"
  },
  {
    title: "Open Order Count",
    dataIndex: "openOrderCount",
    key: "openOrderCount"
  },
  {
    title: "Transaction Amount",
    dataIndex: "transactionAmount",
    key: "transactionAmount"
  },
  {
    title: "Transaction Count",
    dataIndex: "transactionCount",
    key: "transactionCount"
  },
  {
    title: "Withdraw Amount",
    dataIndex: "withdrawAmount",
    key: "withdrawAmount"
  },
  {
    title: "Withdraw Count",
    dataIndex: "withdrawCount",
    key: "withdrawCount"
  }
];
function AuditResult({ auditResult, loading }) {
  return (
    <Card title="Audit Result" className="commonWrap">
      <Table
        style={{ marginTop: 15 }}
        rowKey="withdrawCount"
        columns={AuditColumn}
        dataSource={auditResult}
        loading={loading}
        pagination={false}
      />
    </Card>
  );
}

const UserBalanceColumn = [
  {
    title: "Currency",
    dataIndex: "currency",
    key: "currency"
  },
  {
    title: "Available",
    dataIndex: "available",
    key: "available"
  },
  {
    title: "Balance",
    dataIndex: "balance",
    key: "balance"
  },
  {
    title: "Value In BTC",
    dataIndex: "valueInBTC",
    key: "valueInBTC"
  },
  {
    title: "Value In USD",
    dataIndex: "valueInUSD",
    key: "valueInUSD"
  }
];

const UserTotalBalanceColumn = [
  {
    title: "In Use Value In BTC",
    dataIndex: "inUseValueInBTC",
    key: "inUseValueInBTC"
  },
  {
    title: "In Use Value in USD",
    dataIndex: "inUseValueInUSD",
    key: "inUseValueInUSD"
  },
  {
    title: "Balance Value In BTC",
    dataIndex: "balanceValueInBTC",
    key: "balanceValueInBTC"
  },
  {
    title: "Balance Value In USD",
    dataIndex: "balanceValueInUSD",
    key: "balanceValueInUSD"
  }
];

class UserBalance extends PureComponent {
  state = {
    showAllCurrency: false
  };

  getUserBalanceEntries = () => {
    const { userBalance, currency } = this.props;
    if (!userBalance.entries) return [];
    if (this.state.showAllCurrency) {
      return userBalance.entries;
    }
    for (let item of userBalance.entries) {
      if (item.currency === currency) {
        return [item];
      }
    }
  };

  render() {
    const { userBalance, loading } = this.props;
    return (
      <Card
        title="User Balance"
        className="commonWrap"
        extra={
          <>
            <span>Show All Currencies </span>
            <Switch
              checked={this.state.showAllCurrency}
              onChange={checked => {
                this.setState({ showAllCurrency: checked });
              }}
            />
          </>
        }
      >
        <Table
          style={{ marginTop: 15 }}
          rowKey="currency"
          columns={UserTotalBalanceColumn}
          dataSource={[
            {
              inUseValueInBTC: userBalance.inUseValueInBTC,
              inUseValueInUSD: userBalance.inUseValueInUSD,
              balanceValueInBTC: userBalance.balanceValueInBTC,
              balanceValueInUSD: userBalance.balanceValueInUSD
            }
          ]}
          pagination={false}
          loading={loading}
        />
        <Table
          style={{ marginTop: 50 }}
          rowKey="currency"
          columns={UserBalanceColumn}
          dataSource={this.getUserBalanceEntries()}
          loading={loading}
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
    actions.withdrawInspection.updateData({ inspect: false });
  };

  handleChange = event => {
    this.setState({ selectedValue: event.target.value });
  };

  handleChangeCurrency = (currency, event) => {
    this.setState({ currency });
  };

  getBalance = (walletBalance, currency) => {
    if (walletBalance.balance && walletBalance.balance[currency]) {
      return `balance: ${
        walletBalance.balance[currency].balance
      } ${currency} available: ${walletBalance.balance[currency].available}`;
    }
    return `balance: 0 ${currency} available: 0`;
  };

  render() {
    const { selectedValue, message } = this.state;
    const { walletBalance, currency } = this.props;
    let balance = this.getBalance(walletBalance, currency);

    return (
      <Card title="Inspection Result" className="commonWrap resWrap">
        <Row type="flex" align="middle">{`WALLET BALANCE:`}</Row>
        <Row type="flex" align="middle">
          {`We have ${balance}`}
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
      loading,
      auditResult,
      userBalance
    } = withdrawInspection;
    const { userInfo } = userInspection;

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
        <AuditResult auditResult={auditResult} loading={loading} />
        <UserBalance
          userBalance={userBalance}
          loading={loading}
          currency={currency}
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
