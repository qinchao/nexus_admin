import React from "react";
import {Form} from "antd";
import {StatisticsTemplate} from "./StatisticsTemplate";
import {actions} from "mirrorx";

class DepositStatistics extends StatisticsTemplate {
  constructor(props) {
    super(props);
    this.fetchFunction = actions.depositStatistics.fetchDnwData;
  }

  render() {
    const { loading, depositData} = this.props.depositStatistics;
    let form = this.formTemplate();
    let presentedTable = this.tableTemplate(loading, true, depositData);
    return(
      <div>
        {form}
        {presentedTable}
      </div>
    );
  }
}

const DepositStatisticsForm = Form.create({ name: "deposit_statistics" })(
  DepositStatistics
);

export default DepositStatisticsForm;
