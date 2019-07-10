import React from "react";
import {Form} from "antd";
import {StatisticsTemplate} from "./StatisticsTemplate";
import {actions} from "mirrorx";

class WithdrawStatistics extends StatisticsTemplate {
  constructor(props) {
    super(props);
    this.fetchFunction = actions.withdrawStatistics.fetchDnwData;
  }

  render() {
    const { loading, withdrawData} = this.props.withdrawStatistics;
    let form = this.formTemplate();
    let presentedTable = this.tableTemplate(loading, true, withdrawData);
    return(
      <div>
        {form}
        {presentedTable}
      </div>
    );
  }
}

const WithdrawStatisticsForm = Form.create({ name: "withdraw_statistics" })(
  WithdrawStatistics
);

export default WithdrawStatisticsForm;
