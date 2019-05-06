import React, { PureComponent } from "react";
import DatePicker from "react-datepicker";

import "./DateRange.less";
import { ReactComponent as CalenderIcon } from "Img/calendar.svg";
// import DatePicker from "Components/DatePicker/DatePicker";


class DateRange extends PureComponent {
  state = {
    selectsStart: false,
    selectsEnd: false
  };

  staretDateRef = React.createRef();
  endDateRef = React.createRef();

  handleStartDateCanlederIconClick = () => {
    this.staretDateRef.current.setOpen(true);
  };

  handleEndDateCanlederIconClick = () => {
    this.endDateRef.current.setOpen(true);
  };

  render() {
    const {
      startDate,
      endDate,
      onChangeStartDate,
      onChangeEndDate
    } = this.props;
    const { selectsStart, selectsEnd } = this.state;

    const locale = "en-US";
    const startFocusCN = selectsStart ? " focused" : "";
    const endFocusCN = selectsEnd ? " focused" : "";

    return (
      <div className="pickerWrapper">
        <div className="center">
          <div className="pickerTitle">Date</div>
        </div>
        <div className={"pickerInput" + startFocusCN}>
          <DatePicker
            locale={locale}
            selected={startDate}
            selectsStart
            onFocus={e => {
              this.setState({ selectsStart: true });
            }}
            onBlur={() => {
              this.setState({ selectsStart: false });
            }}
            ref={this.staretDateRef}
            showYearDropdown
            showMonthDropdown
            startDate={startDate}
            endDate={endDate}
            maxDate={new Date()}
            dateFormat="yyyy-MM-dd"
            onChange={onChangeStartDate}
          />
          <CalenderIcon
            className="icon"
            onClick={this.handleStartDateCanlederIconClick}
          />
        </div>
        <div className="center">
          <div className="pickerBetween">-</div>
        </div>
        <div className={"pickerInput" + endFocusCN}>
          <DatePicker
            locale={locale}
            selected={endDate}
            selectsEnd
            showYearDropdown
            showMonthDropdown
            onFocus={e => {
              this.setState({ selectsEnd: true });
            }}
            onBlur={() => {
              this.setState({ selectsEnd: false });
            }}
            ref={this.endDateRef}
            startDate={startDate}
            endDate={endDate}
            maxDate={new Date()}
            dateFormat="yyyy-MM-dd"
            onChange={onChangeEndDate}
          />
          <CalenderIcon
            className="icon"
            onClick={this.handleEndDateCanlederIconClick}
          />
        </div>
      </div>
    );
  }
}

export default DateRange;
