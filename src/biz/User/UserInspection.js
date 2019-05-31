import React, { PureComponent } from "react";
import { Table, Card, Button } from "antd";

import UserProfile from "Components/UserProfile";
import KycProfile from "Components/KycProfile";
import "Biz/Inspection.less";

const MFAColumns = [
  {
    title: "Type",
    dataIndex: "mfaType",
    key: "mfaType"
  },
  {
    title: "Status",
    dataIndex: "enabled",
    key: "enabled",
    render: (text, item) => (
      <>{item.enabled ? "enabled" : "disabled"}</>
    )
  },
  {
    title: "Action",
    dataIndex: "action",
    key: "action",
    render: (text, item) => (
      // TODO: implement the buttons
      <Button size="small" type="primary">
        {item.enabled ? "disable" : "enable"}
      </Button>
    )
  },
];

function formMFAData(userMFASettingList){
  let data = [{mfaType:"SOFTWARE_TOKEN_MFA"},{mfaType:"SMS_MFA"}];
  data[0].enabled = userMFASettingList.includes("SOFTWARE_TOKEN_MFA") ? true:false;
  data[1].enabled = userMFASettingList.includes("SMS_MFA") ? true:false;
  return data;
}

function MFA({userMFASettingList, loading}){
  return (
    <Card title="MFA" className="commonWrap">
      <Table
        style={{ marginTop: 15 }}
        rowKey="mfaType"
        columns={MFAColumns}
        dataSource={formMFAData(userMFASettingList)}
        loading={loading}
        pagination={false}
      />
    </Card>
  );
}


class UserInspection extends PureComponent {
  render() {
    const { userInspection, kycInspection } = this.props;
    const {userInfo, loading} = userInspection;

    return (
      <div className="inspectionWrap">
        <UserProfile userInfo={userInfo} loading={loading} />
        <KycProfile {...kycInspection} />
        <MFA userMFASettingList={userInfo.userMFASettingList} loading={loading}/>
      </div>
    );
  }
}

export default UserInspection;