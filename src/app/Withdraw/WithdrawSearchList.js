import React, { PureComponent } from "react";
import Select from "react-select";
import { Button } from "antd";

import DateRange from "Components/DateRange/DateRange";
import "../SearchList.less";

const ALL = "All";
const WAITING_FOR_USER_CONFIRMATION = "WAITING_FOR_USER_CONFIRMATION";
const WAITING_FOR_AUDIT = "WAITING_FOR_AUDIT";
const WAITING_FOR_MANUAL_APPROVAL = "WAITING_FOR_MANUAL_APPROVAL";
const WAITING_FOR_INVESTIGATION = "WAITING_FOR_INVESTIGATION";
const READY_TO_WITHDRAW = "READY_TO_WITHDRAW";
const DNW_ONGOING = "DNW_ONGOING";
const DNW_SUCC = "DNW_SUCC";
const DNW_FAILED = "DNW_FAILED";
const DNW_EXPIRED = "DNW_EXPIRED";
const DNW_CANCELED = "DNW_CANCELED";
const DNW_REJECTED = "DNW_REJECTED";

const statusOptions = [
  { value: ALL, label: ALL },
  {
    value: WAITING_FOR_USER_CONFIRMATION,
    label: WAITING_FOR_USER_CONFIRMATION
  },
  { value: WAITING_FOR_AUDIT, label: WAITING_FOR_AUDIT },
  { value: WAITING_FOR_MANUAL_APPROVAL, label: WAITING_FOR_MANUAL_APPROVAL },
  { value: WAITING_FOR_INVESTIGATION, label: WAITING_FOR_INVESTIGATION },
  { value: READY_TO_WITHDRAW, label: READY_TO_WITHDRAW },
  { value: DNW_ONGOING, label: DNW_ONGOING },
  { value: DNW_SUCC, label: DNW_SUCC },
  { value: DNW_FAILED, label: DNW_FAILED },
  { value: DNW_EXPIRED, label: DNW_EXPIRED },
  { value: DNW_CANCELED, label: DNW_CANCELED },
  { value: DNW_REJECTED, label: DNW_REJECTED }
];

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
    width: "300px",
    height: "23px",
    color: "#000",

    outline: null,
    border: "1px solid rgba(0,0,0,0.13)",
    boxShadow: null
  })
};

class WithdrawSearchList extends PureComponent {
  state = {
    startDate: new Date(
      new Date(new Date().setMonth(new Date().getMonth() - 1)).setHours(
        0,
        0,
        0,
        0
      )
    ),
    endDate: new Date(new Date().setHours(23, 59, 59, 999)),
    fromRecordId: "",
    toRecordId: "",
    userId: "",
    currency: {
      value: ALL,
      label: ALL
    },
    status: {
      value: WAITING_FOR_MANUAL_APPROVAL,
      label: WAITING_FOR_MANUAL_APPROVAL
    },
    selectFocus: false
  };

  handleChangeStartDate = (startDate, event) => {
    this.setState({ startDate });
    if (startDate > this.state.endDate) {
      this.setState({ endDate: startDate });
    }
  };

  handleChangeEndDate = (endDate, event) => {
    this.setState({ endDate });
    if (endDate < this.state.startDate) {
      this.setState({ startDate: endDate });
    }
  };

  handleChangeFromRecordId = event => {
    let fromRecordId = event.target.value;
    this.setState({ fromRecordId });
  };

  handleChangeToRecordId = event => {
    let toRecordId = event.target.value;
    this.setState({ toRecordId });
  };

  handleChangeUserId = event => {
    this.setState({ userId: event.target.value });
  };

  handleChangeCurrency = (currency, event) => {
    this.setState({ currency });
  };

  handleChangeStatus = (status, event) => {
    this.setState({ status });
  };

  handleSearch = event => {
    const {
      startDate,
      endDate,
      fromRecordId,
      toRecordId,
      userId,
      currency,
      status
    } = this.state;
    let fetchParam = {
      startTime: startDate.getTime().toString(),
      endTime: endDate.getTime().toString()
    };
    if (fromRecordId !== "") {
      fetchParam = {};
      fetchParam.fromRecordId = fromRecordId;
    }
    if (toRecordId !== "") {
      if (!fetchParam.fromRecordId) {
        fetchParam = {};
      }
      fetchParam.toRecordId = toRecordId;
    }
    if (userId !== "") {
      fetchParam.userId = userId;
    }
    if (currency.value !== ALL) {
      fetchParam.currency = currency.value;
    }
    if (status.value !== ALL) {
      fetchParam.status = status.value;
    }
    if (userId === "" && status.value === ALL) {
      fetchParam.status = WAITING_FOR_MANUAL_APPROVAL;
      this.setState({
        status: {
          value: WAITING_FOR_MANUAL_APPROVAL,
          label: WAITING_FOR_MANUAL_APPROVAL
        }
      });
    }
    this.props.onSearch(fetchParam);
  };

  handleReset = event => {
    this.setState({
      startDate: new Date(
        new Date(new Date().setMonth(new Date().getMonth() - 1)).setHours(
          0,
          0,
          0,
          0
        )
      ),
      endDate: new Date(new Date().setHours(23, 59, 59, 999)),
      fromRecordId: "",
      toRecordId: "",
      userId: "",
      currency: {
        value: ALL,
        label: ALL
      },
      status: {
        value: WAITING_FOR_MANUAL_APPROVAL,
        label: WAITING_FOR_MANUAL_APPROVAL
      }
    });
    this.props.onReset();
  };

  render() {
    const { currencies } = this.props;
    const {
      startDate,
      endDate,
      fromRecordId,
      toRecordId,
      currency,
      userId,
      status
    } = this.state;

    return (
      <div className="searchList" style={{ marginBottom: "80px" }}>
        <div className="filterSection">
          <DateRange
            startDate={startDate}
            endDate={endDate}
            onChangeStartDate={this.handleChangeStartDate}
            onChangeEndDate={this.handleChangeEndDate}
          />

          <div className="compWrapper">
            <div className="compTitle">fromRecordId</div>
            <div className="compInput">
              <input
                type="text"
                style={{ width: "70px" }}
                value={fromRecordId}
                onChange={this.handleChangeFromRecordId}
                placeholder={"Number"}
              />
            </div>
          </div>

          <div className="compWrapper">
            <div className="compTitle">toRecordId</div>
            <div className="compInput">
              <input
                type="text"
                style={{ width: "70px" }}
                value={toRecordId}
                onChange={this.handleChangeToRecordId}
                placeholder={"Number"}
              />
            </div>
          </div>

          <div className="compWrapper">
            <div className="compTitle">userId</div>
            <div className="compInput">
              <input
                type="text"
                style={{ width: "100px" }}
                value={userId}
                onChange={this.handleChangeUserId}
                placeholder={"Number"}
              />
            </div>
          </div>
        </div>

        <div className="filterSection">
          <div className="compWrapper">
            <div className="compTitle">currency</div>
            <div className="compInput">
              <Select
                value={currency}
                styles={{ ...selectStyles }}
                isSearchable={true}
                placeholder={ALL}
                onChange={this.handleChangeCurrency}
                options={currencies}
              />
            </div>
          </div>

          <div className="compWrapper">
            <div className="compTitle">status</div>
            <div className="compInput">
              <Select
                value={status}
                styles={{ ...selectStyles }}
                isSearchable={true}
                placeholder={WAITING_FOR_MANUAL_APPROVAL}
                onChange={this.handleChangeStatus}
                options={statusOptions}
              />
            </div>
          </div>

          <div className="compWrapper">
            <Button type="primary" onClick={this.handleSearch}>
              Search
            </Button>
            <Button className="resetButton" onClick={this.handleReset}>
              Reset
            </Button>
          </div>
        </div>

        <div style={{ marginTop: "10px" }}>Note:</div>
        <div>
          {
            "1.Without filtering, you are looking at all the withdraw records with status: WAITING_FOR_MANUAL_APPROVAL."
          }
        </div>
        <div>
          {
            "2.While using the filter, if you didn't specify a userId, you must specify a withdraw status; Otherwise, the status will be set to WAITING_FOR_MANUAL_APPROVAL by default."
          }
        </div>
        <div>
          {
            "3.Except for Date, if you didn't change the values in the boxes, they will not be in the filter"
          }
        </div>
        <div>
          {
            "4.If you input fromRecordId or toRecordId, Date will not be in the filer."
          }
        </div>
      </div>
    );
  }
}

export default WithdrawSearchList;
