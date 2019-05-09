import React, { PureComponent } from "react";
import { actions, NavLink } from "mirrorx";
import { formatDistance } from "date-fns";
// import TableCell from "@material-ui/core/TableCell";
// import TableRow from "@material-ui/core/TableRow";
import { Button, Empty } from "antd";

import { getTimeColor } from "Utils/index";
import SimpleTable from "Components/SimpleTable";
import WithdrawSearchList from "./WithdrawSearchList";

class Withdraw extends PureComponent {
  withdrawTabTitles = [
    "User",
    "RecordId",
    "Currency",
    "Amount",
    "Status",
    "Time",
    "Message",
    ""
  ];

  // withdrawRenderRow = item => {
  //   return (
  //     <TableRow className="listItemLine" key={item.recordId}>
  //       <TableCell align="right">{item.userId}</TableCell>
  //       <TableCell align="right">{item.recordId}</TableCell>
  //       <TableCell align="right">{item.currency}</TableCell>
  //       <TableCell align="right">{item.amount}</TableCell>
  //       <TableCell align="right">{item.status}</TableCell>
  //       <TableCell
  //         align="right"
  //         style={
  //           getTimeColor(new Date(item.createTime)) ? { color: "red" } : {}
  //         }
  //       >
  //         {formatDistance(item.createTime, Date.now(), { addSuffix: true })}
  //       </TableCell>
  //       <TableCell align="right">
  //         {item.message ? item.message : "N/A"}
  //       </TableCell>
  //       <TableCell align="right">
  //         {item.status === "WAITING_FOR_MANUAL_APPROVAL" ||
  //         item.status === "WAITING_FOR_INVESTIGATION" ? (
  //           <NavLink
  //             to={`/operation/withdrawInspection?userId=${
  //               item.userId
  //             }&recordId=${item.recordId}&currency=${
  //               item.currency
  //             }&inspect=true`}
  //             target="_blank"
  //             activeClassName="selected"
  //           >
  //             <Button className="resetButton" type="primary">
  //               Inspect
  //             </Button>
  //           </NavLink>
  //         ) : (
  //           <NavLink
  //             to={`/operation/withdrawInspection?userId=${
  //               item.userId
  //             }&recordId=${item.recordId}&inspect=false`}
  //             target="_blank"
  //             activeClassName="selected"
  //           >
  //             <Button className="resetButton" type="primary">
  //               Review
  //             </Button>
  //           </NavLink>
  //         )}
  //       </TableCell>
  //     </TableRow>
  //   );
  // };

  handleWithdrawSearch = fetchParam => {
    actions.operation.fetchWithdraw(fetchParam);
  };

  handleWithdrawReset = () => {
    let fetchParam = { status: "WAITING_FOR_MANUAL_APPROVAL" };
    this.handleWithdrawSearch(fetchParam);
  };

  render() {
    const { loading, list, currencies } = this.props;
    return (
      <div className="panelBox">
        <WithdrawSearchList
          onSearch={this.handleWithdrawSearch}
          onReset={this.handleWithdrawReset}
          currencies={currencies}
        />
        <SimpleTable
          loading={loading}
          tabTitles={this.withdrawTabTitles}
          renderRow={this.withdrawRenderRow}
          list={list}
          empty={<Empty text={"No Withdraw Record to Show"} />}
        />
      </div>
    );
  }
}

export default Withdraw;
