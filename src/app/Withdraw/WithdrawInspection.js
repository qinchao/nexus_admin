import React, { PureComponent } from "react";
import { actions } from "mirrorx";
// import TableCell from "@material-ui/core/TableCell";
// import TableRow from "@material-ui/core/TableRow";
import { Empty } from "antd";

import { formatDate } from "Utils/index";
import { Radio, Switch, Select } from "antd";

import Popup from "Components/Popup/Popup";
import SimpleTable from "Components/SimpleTable";

import "./WithdrawInspection.less";

const selectStyles = {
  option: (styles, { isFocused, isSelected }) => {
    return {
      ...styles,
      backgroundColor: isSelected || isFocused ? "#fff" : "#fff",
      color: "#000"
    };
  },
  placeholder: styles => {
    return {
      ...styles,
      color: "white"
    };
  },
  singleValue: styles => {
    return {
      ...styles,
      color: "#000",
      margin: "0",
      borderRadius: "1px"
    };
  },
  noOptionsMessage: styles => {
    return {
      ...styles,
      color: "#000"
    };
  },
  valueContainer: styles => {
    return {
      ...styles,
      padding: "0 5px 0 9px"
    };
  },
  menu: styles => {
    return {
      ...styles,
      backgroundColor: "#fff",
      borderRadius: "0",
      border: "none"
    };
  },
  menuList: styles => {
    return {
      ...styles,
      width: "300px",
      background: "#fff",
      border: "none",
      borderRadius: "0",
      paddingTop: 0,
      paddingBottom: 0
    };
  },
  indicatorSeparator: styles => {
    return {
      ...styles,
      display: "none"
    };
  },
  dropdownIndicator: styles => {
    return {
      ...styles,
      padding: "0",
      borderTop: "4px solid rgba(0,0,0,0.6)",
      borderLeft: "3px solid transparent",
      borderRight: "3px solid transparent",
      borderBottom: "none"
    };
  },
  indicatorsContainer: styles => {
    return {
      ...styles,
      alignSelf: "center",
      paddingRight: "4px"
    };
  },
  control: (styles, { isFocused }) => ({
    borderRadius: "1px",
    flex: "1 1 auto",
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#fff",
    width: "100px",
    height: "23px",
    color: "#000",

    outline: null,
    border: "1px solid rgba(0,0,0,0.13)",
    boxShadow: null
  })
};

class UserProfile extends PureComponent {
  titles = [
    "Email",
    "Create Time",
    "Last Modified",
    "Last Name",
    "First Name",
    "Country or Region"
  ];
  // renderRow = item => {
  //   return (
  //     <TableRow className="listItemLine" key={item.userCreateDate}>
  //       <TableCell align="right">{item.email ? item.email : "N/A"}</TableCell>
  //       <TableCell align="right">
  //         {item.userCreateDate
  //           ? formatDate(new Date(item.userCreateDate))
  //           : "N/A"}
  //       </TableCell>
  //       <TableCell align="right">
  //         {item.userLastModifiedDate
  //           ? formatDate(new Date(item.userLastModifiedDate))
  //           : "N/A"}
  //       </TableCell>
  //       <TableCell align="right">
  //         {item.lastName ? item.lastName : "N/A"}
  //       </TableCell>
  //       <TableCell align="right">
  //         {item.firstName ? item.firstName : "N/A"}
  //       </TableCell>
  //       <TableCell align="right">
  //         {item.countryOrRegion ? item.countryOrRegion : "N/A"}
  //       </TableCell>
  //     </TableRow>
  //   );
  // };
  render() {
    return (
      <div className="userWrap commonWrap">
        <div className="title">User Profile</div>
        <div className="content">
          <SimpleTable
            tabTitles={this.titles}
            renderRow={this.renderRow}
            list={[this.props.userInfo]}
            loading={this.props.loading}
            empty={<Empty text={"No KYC Record to Show"} />}
          />
        </div>
      </div>
    );
  }
}

class Login extends PureComponent {
  titles = [
    "Event",
    "Create Time",
    "Response",
    "Device",
    "Ip Address",
    "City",
    "Country or Region"
  ];
  // renderRow = item => {
  //   return (
  //     <TableRow className="listItemLine" key={item.creationDate}>
  //       <TableCell align="right">{item.eventType}</TableCell>
  //       <TableCell align="right">
  //         {formatDate(new Date(item.creationDate))}
  //       </TableCell>
  //       <TableCell align="right">{item.eventResponse}</TableCell>
  //       <TableCell align="right">{item.deviceName}</TableCell>
  //       <TableCell align="right">{item.ipAddress}</TableCell>
  //       <TableCell align="right">{item.city}</TableCell>
  //       <TableCell align="right">{item.country}</TableCell>
  //     </TableRow>
  //   );
  // };
  render() {
    return (
      <div className="loginWrap commonWrap">
        <div className="title">Login History</div>
        <div className="content">
          <SimpleTable
            tabTitles={this.titles}
            renderRow={this.renderRow}
            list={this.props.loginHistory}
            loading={this.props.loading}
            empty={<Empty text={"No Login History to Show"} />}
          />
        </div>
      </div>
    );
  }
}

class WithdrawHistory extends PureComponent {
  state = { showAllCurrency: false };
  titles = [
    "RecordId",
    "Currency",
    "Amount",
    "Source Addres",
    "Address",
    // "Confirmed Number",
    "Device",
    "Ip Address",
    "Inspector Id",
    "Inspect Time",
    "Create Time",
    "Update Time",
    "Status",
    "Note"
  ];

  // TODO hide the whole column
  // renderRow = item => {
  //   let style =
  //     item.recordId === this.props.recordId
  //       ? "listItemLine curRecordId"
  //       : "listItemLine";
  //   return (
  //     <TableRow className={style} key={item.recordId}>
  //       {/* For testing purpose <TableCell>{item.userId}</TableCell> */}
  //       <TableCell align="right">{item.recordId}</TableCell>
  //       <TableCell align="right">{item.currency}</TableCell>
  //       <TableCell align="right">{item.amount}</TableCell>
  //       <TableCell align="right">
  //         {item.sourceAddress ? item.sourceAddress : "N/A"}
  //       </TableCell>
  //       <TableCell align="right">
  //         {item.address ? item.address : "N/A"}
  //       </TableCell>
  //       {/* May added later <TableCell align="right">{item.confirmedNum}</TableCell> */}
  //       <TableCell align="right">{item.device ? item.device : "N/A"}</TableCell>
  //       <TableCell align="right">
  //         {item.ipAddress ? item.ipAddress : "N/A"}
  //       </TableCell>
  //       <TableCell align="right">
  //         {item.manualReviewerId === 0 ? "N/A" : item.manualReviewerId}
  //       </TableCell>
  //       <TableCell align="right">{formatDate(item.manualReviewTime)}</TableCell>
  //       <TableCell align="right">{formatDate(item.createTime)}</TableCell>
  //       <TableCell align="right">{formatDate(item.updateTime)}</TableCell>
  //       <TableCell align="right">{item.status}</TableCell>
  //       <TableCell align="right">
  //         {item.message ? item.message : "N/A"}
  //       </TableCell>
  //     </TableRow>
  //   );
  // };

  renderRowWithCondition = item => {
    return this.state.showAllCurrency
      ? this.renderRow(item)
      : this.props.currency.value === item.currency
      ? this.renderRow(item)
      : "";
  };

  render() {
    return (
      <div className="hisWrap commonWrap">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div className="title">Withdraw History</div>
          <div className="hideAllCancelled">
            <Switch
              checkedValue={this.state.showAllCurrency}
              clickEvent={event => {
                this.setState({ showAllCurrency: event.target.checked });
              }}
              valueName="showAllCurrency"
              labelName={"Show All Currency"}
            />
          </div>
        </div>
        <div className="content" />
        <SimpleTable
          tabTitles={this.titles}
          renderRow={this.renderRowWithCondition}
          list={this.props.withdrawHistory}
          loading={this.props.loading}
          empty={<Empty text={"No Withdraw Record to Show"} />}
        />
      </div>
    );
  }
}

class InspectResult extends PureComponent {
  state = {
    selectedValue: "",
    showPop: false,
    message: ""
  };

  onClickSubmit = (action, message) => {
    let params = {
      dnwRecordId: this.props.recordId,
      action: action,
      message: message
    };
    actions.withdraw.withdrawUpdate(params);
    this.setState({ showPop: false });
  };

  onClickCancel = () => {
    this.setState({ showPop: false });
  };

  handleChange = event => {
    this.setState({ selectedValue: event.target.value });
  };

  handleChangeCurrency = (currency, event) => {
    this.setState({ currency });
  };

  getBalance = (walletBalance, currency) => {
    if (walletBalance.balance && walletBalance.balance[currency]) {
      return `balance: ${walletBalance.balance[currency].balance} available: ${
        walletBalance.balance[currency].available
      }`;
    } else {
      return 0;
    }
  };

  render() {
    const { selectedValue, message, showPop } = this.state;
    const { walletBalance, currency } = this.props;
    let balance = this.getBalance(walletBalance, currency.value);

    return (
      <div className="resWrap commonWrap">
        <div className="title">Inspection Result</div>
        <div className="amount">
          {`BALANCE: We have ${balance}`}
          {balance ? (
            <div style={{ paddingLeft: "20px" }}>
              <Select
                value={currency}
                styles={{ ...selectStyles }}
                isSearchable={true}
                placeholder={currency.label}
                onChange={currency =>
                  actions.withdrawInspection.updateData({ currency })
                }
                options={walletBalance.options}
              />
            </div>
          ) : (
            ""
          )}
        </div>
        <div>
          <div>Approve</div>
          <Radio
            checked={selectedValue === "MANUALLY_APPROVE"}
            onChange={this.handleChange}
            value="MANUALLY_APPROVE"
            color="default"
          />
        </div>
        <div>
          <div>Reject</div>
          <Radio
            checked={selectedValue === "MANUALLY_REJECT"}
            onChange={this.handleChange}
            value="MANUALLY_REJECT"
            color="default"
          />
          <textarea
            value={message}
            onChange={event => {
              this.setState({
                message: event.target.value
              });
            }}
          />
        </div>

        <button
          onClick={() => this.setState({ showPop: true })}
          disabled={
            selectedValue === "" ||
            (selectedValue === "MANUALLY_REJECT" && !message)
          }
        >
          Submit
        </button>

        {showPop ? (
          <Popup
            onClickSubmit={() => this.onClickSubmit(selectedValue, message)}
            onClickCancel={this.onClickCancel}
          >
            <div className="warning">{`Are you sure you want submit the ${selectedValue}?`}</div>
          </Popup>
        ) : (
          ""
        )}
      </div>
    );
  }
}

class WithdrawInspection extends PureComponent {
  render() {
    const { withdrawInspection } = this.props;
    const {
      userInfo,
      curRecordId,
      withdrawHistory,
      inspect,
      walletBalance,
      currency,
      loading
    } = withdrawInspection;

    return (
      <div className="inspectionWrap">
        <UserProfile userInfo={userInfo} loading={loading} />
        {/* TODO get the login history of a specific user */}
        <Login loginHistory={userInfo.authHistory} loading={loading} />
        <WithdrawHistory
          recordId={curRecordId}
          withdrawHistory={withdrawHistory}
          loading={loading}
          currency={currency}
        />
        {inspect ? (
          <InspectResult
            recordId={curRecordId}
            walletBalance={walletBalance}
            currency={currency}
          />
        ) : (
          ""
        )}
      </div>
    );
  }
}

export default WithdrawInspection;
