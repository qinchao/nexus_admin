import React, { PureComponent } from "react";
import { Descriptions } from "antd";
import "Biz/Inspection.less";

class DepositInspection extends PureComponent {
  render() {
    const { curRecord } = this.props.deposit;
    return (
      <Descriptions title="Deposit Information">
        <Descriptions.Item label="User Id">
          {curRecord.userId}
        </Descriptions.Item>
        <Descriptions.Item label="Record Id">
          {curRecord.recordId}
        </Descriptions.Item>
        <Descriptions.Item label="Amount">{curRecord.amount}</Descriptions.Item>
        <Descriptions.Item label="Currency">
          {curRecord.currency}
        </Descriptions.Item>
        <Descriptions.Item label="Create Time">
          {curRecord.createTime}
        </Descriptions.Item>
        <Descriptions.Item label="Source Address">
          {curRecord.sourceAddress}
        </Descriptions.Item>
        <Descriptions.Item label="Address">
          {curRecord.address}
        </Descriptions.Item>
        <Descriptions.Item label="Txid">{curRecord.txid}</Descriptions.Item>
        <Descriptions.Item label="Fees">{curRecord.fees}</Descriptions.Item>
        <Descriptions.Item label="VoutN">{curRecord.voutN}</Descriptions.Item>
        <Descriptions.Item label="SubAccount Id">
          {curRecord.subAccountId}
        </Descriptions.Item>
        <Descriptions.Item label="Confirmed Numbers">
          {curRecord.confirmedNum}
        </Descriptions.Item>
        <Descriptions.Item label="Confirming Threshold">
          {curRecord.confirmingThreshold}
        </Descriptions.Item>
        <Descriptions.Item label="Update Time">
          {curRecord.updateTime}
        </Descriptions.Item>
      </Descriptions>
    );
  }
}

export default DepositInspection;
