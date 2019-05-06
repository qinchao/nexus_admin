import React from "react";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Loading from "Components/Loading/Loading";

function SimpleTable(props) {
  const { loading, tabTitles, renderRow, list, empty } = props;

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            {tabTitles.map(title => (
              <TableCell key={title} align="right">
                {title}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
        {loading ? <Loading /> : list.length ? list.map(renderRow) : empty}
        </TableBody>
      </Table>
    </>
  );
}

export default SimpleTable;
