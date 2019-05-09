import React, { PureComponent } from "react";
import Select from "react-select";

import { Button } from "antd";
import DateRange from "Components/DateRange/DateRange";
import "../SearchList.less";

const ALL = "All";
const PENDING_FOR_REVIEW = "PENDING_FOR_REVIEW";
const DENIED = "DENIED";
const APPROVED = "APPROVED";

const statusOptions = [
  { value: ALL, label: ALL },
  {
    value: PENDING_FOR_REVIEW,
    label: PENDING_FOR_REVIEW
  },
  { value: DENIED, label: DENIED },
  { value: APPROVED, label: APPROVED }
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

class KycSearchList extends PureComponent {
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
    userId: "",
    status: {
      value: PENDING_FOR_REVIEW,
      label: PENDING_FOR_REVIEW
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

  handleChangeUserId = event => {
    this.setState({ userId: event.target.value });
  };

  handleChangeStatus = (status, event) => {
    this.setState({ status });
  };

  handleSearch = event => {
    const { startDate, endDate, userId, status } = this.state;
    let fetchParam = {
      startTime: startDate.getTime().toString(),
      endTime: endDate.getTime().toString()
    };
    if (userId !== "") {
      fetchParam.userId = userId;
    }
    if (status.value !== ALL) {
      fetchParam.status = status.value;
    }
    if (userId === "" && status.value === ALL) {
      fetchParam.status = PENDING_FOR_REVIEW;
      this.setState({
        status: {
          value: PENDING_FOR_REVIEW,
          label: PENDING_FOR_REVIEW
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
      userId: "",
      status: {
        value: PENDING_FOR_REVIEW,
        label: PENDING_FOR_REVIEW
      }
    });
    this.props.onReset();
  };

  render() {
    const { startDate, endDate, userId, status } = this.state;

    return (
      <div className="searchList" style={{ marginBottom: "30px" }}>
        <div className="filterSection">
          <DateRange
            startDate={startDate}
            endDate={endDate}
            onChangeStartDate={this.handleChangeStartDate}
            onChangeEndDate={this.handleChangeEndDate}
          />

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

          <div className="compWrapper">
            <div className="compTitle">status</div>
            <div className="compInput">
              <Select
                value={status}
                styles={{ ...selectStyles }}
                isSearchable={true}
                placeholder={PENDING_FOR_REVIEW}
                onChange={this.handleChangeStatus}
                options={statusOptions}
              />
            </div>
          </div>

          <div className="compWrapper">
            <Button type="primary" onClick={this.handleSearch}>
              Search
            </Button>
            <Button
              className="resetButton"
              type="primary"
              onClick={this.handleReset}
            >
              Reset
            </Button>
          </div>
        </div>
        <div style={{ marginTop: "10px" }}>Note:</div>
        <div>
          {
            "1.Without filtering, you are looking at all the withdraw records with status: PENDING_FOR_REVIEW."
          }
        </div>
        <div>
          {
            "2.While using the filter, you have to specifiy a userId or kyc status; Otherwise, the status will be set to PENDING_FOR_REVIEW by default."
          }
        </div>
      </div>
    );
  }
}

export default KycSearchList;
