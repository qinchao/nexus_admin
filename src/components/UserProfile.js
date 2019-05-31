import React from "react";
import { Table, Card, Tooltip, Icon } from "antd";

import { formatDate } from "Utils/index";
import "Biz/Inspection.less";

const UserProfileColumns = [
  {
    title: "User Id",
    dataIndex: "userId",
    key: "userId",
    render: (text, item) => <>{item["custom:id"] || "N/A"}</>
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
    render: (text, item) => <>{item.email || "N/A"}</>
  },
  {
    title: "User Name",
    dataIndex: "userName",
    key: "userName",
    render: (text, item) => <>{(item.lastName && item.firstName) ? item.lastName+", "+item.firstName : "N/A" }</>
  },
  {
    title: "Phone Number",
    dataIndex: "phoneNumber",
    key: "phoneNumber",
    render: (text, item) => <>{item.phone_number || "N/A"}</>
  },
  {
    title: "Country or Region",
    dataIndex: "countryOrRegion",
    key: "countryOrRegion",
    render: (text, item) => <>{item.countryOrRegion || "N/A"}</>
  },
  {
    title: "Account Status",
    dataIndex: "accountStatus",
    key: "accountStatus",
    render: (text, item) => <>{item.enabled ? "enabled" : "disabled"}</>
  },
  {
    title: 
      <Tooltip title="The above date is the account creation date. The below is the last modified date.">
        Account Time  <Icon type="question-circle" />
      </Tooltip>,
    dataIndex: "accountTime",
    key: "accountTime",
    render: (text, item) => (
      <>
      <div>
        {item.userCreateDate
          ? formatDate(new Date(item.userCreateDate))
          : "N/A"}
      </div>
      <div>
        {item.userLastModifiedDate
        ? formatDate(new Date(item.userLastModifiedDate))
        : "N/A"}
      </div>
      </>
    )
  },
];

export default function({ userInfo, loading }) {
  return (
    <Card title="User Profile" className="commonWrap userWrap">
      <Table
        style={{ marginTop: 15 }}
        rowKey={item => item.userId}
        columns={UserProfileColumns}
        dataSource={[userInfo]}
        loading={loading}
        pagination={false}
      />
    </Card>
  );
}