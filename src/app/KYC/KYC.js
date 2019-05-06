import React, { PureComponent } from "react";
import { actions, NavLink } from "mirrorx";
import { formatDistance } from "date-fns";

import { Button, Empty } from "antd";

import SimpleTable from "Components/SimpleTable";
import { getTimeColor, formatDate } from "Utils/index";

import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import KycSearchList from "./KYCSearchList";

class KYC extends PureComponent {
  kycTabTitles = [
    "User",
    "Status",
    "Time",
    "Inspector",
    "Inspect Time",
    "Message",
    ""
  ];

  kycRenderRow = item => {
    return (
      <TableRow className="listItemLine" key={item.userId + item.kycStatus}>
        <TableCell align="right">{item.userId}</TableCell>
        <TableCell align="right">{item.kycStatus}</TableCell>
        <TableCell
          align="right"
          style={
            getTimeColor(new Date(item.createTime)) ? { color: "red" } : {}
          }
        >
          {formatDistance(item.createTime, Date.now(), { addSuffix: true })}
        </TableCell>
        <TableCell align="right">
          {item.inspector ? item.inspector : "N/A"}
        </TableCell>
        <TableCell align="right">
          {item.inspectTime ? formatDate(item.inspectTime) : "N/A"}
        </TableCell>
        <TableCell align="right">
          {item.message ? item.message : "N/A"}
        </TableCell>
        <TableCell align="right">
          {item.kycStatus === "PENDING_FOR_REVIEW" ? (
            <NavLink
              to={`/operation/kycInspection?userId=${item.userId}&createTime=${
                item.createTime
              }&inspect=true`}
              target="_blank"
              activeClassName="selected"
            >
              <Button className="resetButton" size="small" width="61">
                Inspect
              </Button>
            </NavLink>
          ) : (
            <NavLink
              to={`/operation/kycInspection?userId=${item.userId}&createTime=${
                item.createTime
              }&inspect=false`}
              target="_blank"
              activeClassName="selected"
            >
              <Button className="resetButton" size="small" width="61">
                Review
              </Button>
            </NavLink>
          )}
        </TableCell>
      </TableRow>
    );
  };

  handleKycSearch = fetchParam => {
    actions.operation.fetchKyc(fetchParam);
  };

  handleKycReset = () => {
    let fetchParam = { status: "PENDING_FOR_REVIEW" };
    this.handleKycSearch(fetchParam);
  };

  render() {
    const { loading, list } = this.props;
    return (
      <>
        <KycSearchList
          onSearch={this.handleKycSearch}
          onReset={this.handleKycReset}
        />
        <SimpleTable
          loading={loading}
          tabTitles={this.kycTabTitles}
          renderRow={this.kycRenderRow}
          list={list}
          empty={<Empty text={"No KYC Record to Show"} />}
        />
      </>
    );
  }
}

export default KYC;
