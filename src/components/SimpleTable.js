import React from "react";
import { Table } from "antd";

function SimpleTable(props) {
  const { loading, renderRow, list } = props;

  return <Table dataSource={list} columns={renderRow} loading={loading} />;
}

export default SimpleTable;
