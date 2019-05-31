import React from "react";
import { Card, Empty } from "antd";

import "Biz/Inspection.less";

export default function({ kycInfo, frontImage, backImage, humanImage }) {
  return (
    <Card title="KYC Information" className="commonWrap infoWrap">
      {kycInfo.firstName ?
        <div className="content">
        <div className="line">
          <span className="label">Name:</span>
          {kycInfo.firstName + " " + kycInfo.lastName}
        </div>
        <div className="line">
          <span className="label">Country or Region:</span>
          {kycInfo.countryOrRegion}
        </div>
        <div className="line">
          <span className="label">Id Type:</span> {kycInfo.idType}
        </div>
        <div className="line">
          <span className="label">Id Number:</span> {kycInfo.idNumber}
        </div>
        <div className="line pictures">
          <span className="label">Front Image:</span>
          <img src={`data:image/jpeg;base64,${frontImage}`} alt="Front" />
        </div>
        <div className="line pictures">
          <span className="label">Back Image:</span>
          <img src={`data:image/jpeg;base64,${backImage}`} alt="Back" />
        </div>
        <div className="line pictures">
          <span className="label">Human Image:</span>
          <img src={`data:image/jpeg;base64,${humanImage}`} alt="Human" />
        </div>
      </div>
      :
      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="The user haven't submit the KYC profile."/>
    } 
    </Card>
  );
}