import React, { PureComponent } from "react";
import { actions } from "mirrorx";
import { Button, Table, Checkbox, Card, Modal } from "antd";

import { formatDate } from "Utils/index";
import "Biz/Inspection.less";

function showPopConfirm(title = "", content = "", submitFunc) {
  Modal.confirm({
    title,
    content,
    onOk: () => submitFunc()
  });
}

function KYCInfo({ kycInfo, frontImage, backImage, humanImage }) {
  return (
    <Card title="KYC Information" className="commonWrap infoWrap">
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
    </Card>
  );
}

const columns = [
  {
    title: "Last Name",
    dataIndex: "lastName",
    key: "lastName"
  },
  {
    title: "First Name",
    dataIndex: "firstName",
    key: "firstName"
  },
  {
    title: "Id Type",
    dataIndex: "idType",
    key: "idType"
  },
  {
    title: "Id Number",
    dataIndex: "idNumber",
    key: "idNumber"
  },
  {
    title: "Country or Region",
    dataIndex: "countryOrRegion",
    key: "countryOrRegion"
  },
  {
    title: "Create Time",
    dataIndex: "createTime",
    key: "createTime",
    render: (text, item) => (
      <>{item.createTime ? formatDate(item.createTime) : "N/A"}</>
    )
  },
  {
    title: "Status",
    dataIndex: "kycStatus",
    key: "kycStatus"
  },
  {
    title: "Inspect",
    dataIndex: "inspector",
    key: "inspector",
    render: (text, item) => <>{item.inspector || "N/A"}</>
  },
  {
    title: "Inspect Time",
    dataIndex: "inspectTime",
    key: "inspectTime",
    render: (text, item) => (
      <span>{item.inspectTime ? formatDate(item.inspectTime) : "N/A"}</span>
    )
  },
  {
    title: "Note",
    key: "message",
    dataIndex: "message",
    render: (text, item) => (
      <div className="wordBreak" style={{ maxWidth: 300 }}>
        {item.message ? item.message.split(",").join("; ") : "N/A"}
      </div>
    )
  }
];
function ReviewHistory({ reviewHistory, loading }) {
  return (
    <Card title="Review History" className="commonWrap reviewWrap">
      <Table
        style={{ marginTop: 15 }}
        rowKey={item => item.userId + item.createTime}
        columns={columns}
        dataSource={reviewHistory}
        loading={loading}
      />
    </Card>
  );
}

// const KYC_STATUS_APPROVED = "APPROVED";

const KYC_STATUS_APPROVED = {
  value: "APPROVED",
  label: "APPROVED"
};
const KYC_STATUS_REJECT = [
  { label: "AML_FAILED", value: "AML_FAILED" },
  { label: "UNSUPPORTED_ID_TYPE", value: "UNSUPPORTED_ID_TYPE" },
  { label: "UNSUPPORTED_ID_COUNTRY", value: "UNSUPPORTED_ID_COUNTRY" },
  { label: "MANIPULATED_DOCUMENT", value: "MANIPULATED_DOCUMENT" },
  { label: "PHOTO_MISMATCH", value: "PHOTO_MISMATCH" },
  { label: "PUNCHED_DOCUMENT", value: "PUNCHED_DOCUMENT" },
  {
    label: "MISMATCH_PRINTED_BARCODE_DATA",
    value: "MISMATCH_PRINTED_BARCODE_DATA"
  },
  { label: "NOT_ORIGINAL_DOC", value: "NOT_ORIGINAL_DOC" },
  { label: "NOT_READABLE_DOCUMENT", value: "NOT_READABLE_DOCUMENT" },
  { label: "MISSING_PART_DOCUMENT", value: "MISSING_PART_DOCUMENT" },
  { label: "NO_DOCUMENT", value: "NO_DOCUMENT" },
  { label: "CAMERA_BLACK_WHITE", value: "CAMERA_BLACK_WHITE" },
  { label: "NOT_VALID_DUCUMENT", value: "NOT_VALID_DUCUMENT" },
  { label: "WRONG_DOCUMENT_PAGE", value: "WRONG_DOCUMENT_PAGE" },
  { label: "DIFFERENT_PERSONS_SHOWN", value: "DIFFERENT_PERSONS_SHOWN" }
];

class InspectResult extends PureComponent {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.groupOnChange = this.groupOnChange.bind(this);
    this.onClickSubmit = this.onClickSubmit.bind(this);
    this.state = {
      approved: "",
      reject: []
    };
  }

  onChange(e) {
    this.setState({
      approved: e.target.checked,
      reject: []
    });
  }

  groupOnChange(checkedValues) {
    this.setState({
      approved: false,
      reject: checkedValues
    });
  }

  onClickSubmit = async () => {
    const { approved, reject } = this.state;
    const { userId, createTime } = this.props;

    const params = {
      userId,
      createTime,
      status: approved ? "APPROVED" : "DENIED",
      message: approved ? "APPROVED" : reject.join(",")
    };

    await actions.kyc.kycStatusUpdate(params);
  };

  render() {
    const { approved, reject } = this.state;

    const confirmTitle = approved
      ? "Are you sure you want to accept the kyc?"
      : "Are you sure you want to submit the review with the following reasons?";
    const confirmContent = approved ? "" : reject.join(",");

    return (
      <Card title="Inspection Result" className="commonWrap resWrap">
        <div className="content">
          <Card type="inner" title="Approve">
            <Checkbox checked={approved} onChange={this.onChange}>
              {KYC_STATUS_APPROVED.label}
            </Checkbox>
          </Card>
          <Card type="inner" title="Reject" style={{ margin: "15px 0" }}>
            <Checkbox.Group
              className="checkboxGroup"
              options={KYC_STATUS_REJECT}
              value={reject}
              onChange={this.groupOnChange}
            />
          </Card>

          <Button
            disabled={!approved && !reject.length}
            onClick={() => {
              showPopConfirm(confirmTitle, confirmContent, this.onClickSubmit);
            }}
          >
            Submit
          </Button>
        </div>
      </Card>
    );
  }
}

class KYCInspection extends PureComponent {
  render() {
    const { reviewHistory, inspect, userId, createTime, loading } = this.props;
    console.log(this.props);

    return (
      <div className="inspectionWrap">
        <KYCInfo {...this.props} />
        <ReviewHistory
          reviewHistory={reviewHistory}
          createTime={createTime}
          loading={loading}
        />
        {inspect ? (
          <InspectResult userId={userId} createTime={createTime} />
        ) : (
          ""
        )}
      </div>
    );
  }
}

export default KYCInspection;
