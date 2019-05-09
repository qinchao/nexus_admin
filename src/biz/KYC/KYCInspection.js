import React, { PureComponent } from "react";
import { actions } from "mirrorx";
import { Empty } from "antd";

import { formatDate } from "Utils/index";

import SimpleTable from "Components/SimpleTable";
import Popup from "Components/Popup/Popup";
import "./KYCInspection.less";

class KYCInfo extends PureComponent {
  Item = (title, content) => {
    return <div>{`${title}: ${content}`}</div>;
  };
  render() {
    const { kycInfo, frontImage, backImage, humanImage } = this.props;
    return (
      <div className="infoWrap commonWrap">
        <div className="title">KYC Information</div>
        <div className="content">
          <div className="line">
            {this.Item("Name", kycInfo.firstName + " " + kycInfo.lastName)}
          </div>
          <div className="line">
            {this.Item("Country or Region", kycInfo.countryOrRegion)}
          </div>
          <div className="line">{this.Item("Id Type", kycInfo.idType)}</div>
          <div className="line">{this.Item("Id Number", kycInfo.idNumber)}</div>
          <div className="pictures">
            <div>
              <div>Front Image</div>
              <img src={`data:image/jpeg;base64,${frontImage}`} alt="Front" />
            </div>
            <div>
              <div>Back Image</div>
              <img src={`data:image/jpeg;base64,${backImage}`} alt="Back" />
            </div>
            <div>
              <div>Human Image</div>
              <img src={`data:image/jpeg;base64,${humanImage}`} alt="Human" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class ReviewHistory extends PureComponent {
  titles = [
    "Last Name",
    "First Name",
    "Id Type",
    "Id Number",
    "Country or Region",
    "Create Time",
    "Status",
    "Inspector",
    "Inspect Time",
    "Note"
  ];

  // renderRow = item => {
  //   let style =
  //     item.createTime === this.props.createTime
  //       ? "listItemLine curRecordId"
  //       : "listItemLine";
  //   return (
  //     <TableRow className={style} key={item.createTime}>
  //       <TableCell align="right">{item.lastName}</TableCell>
  //       <TableCell align="right">{item.firstName}</TableCell>
  //       <TableCell align="right">{item.idType}</TableCell>
  //       <TableCell align="right">{item.idNumber}</TableCell>
  //       <TableCell align="right">{item.countryOrRegion}</TableCell>
  //       <TableCell align="right">{formatDate(item.createTime)}</TableCell>
  //       <TableCell align="right">{item.kycStatus}</TableCell>
  //       <TableCell align="right">
  //         {item.inspector ? item.inspector : "N/A"}
  //       </TableCell>
  //       <TableCell align="right">
  //         {item.inspectTime ? item.inspectTime : "N/A"}
  //       </TableCell>
  //       <TableCell
  //         align="right"
  //         style={{
  //           whiteSpace: "normal",
  //           wordWrap: "break-word"
  //         }}
  //       >
  //         {item.message ? item.message.split(",").join("; ") : "N/A"}
  //       </TableCell>
  //     </TableRow>
  //   );
  // };
  render() {
    return (
      <div className="reviewWrap commonWrap">
        <div className="title">Review History</div>
        <div className="content" />
        <SimpleTable
          tabTitles={this.titles}
          renderRow={this.renderRow}
          list={this.props.reviewHistory}
          loading={this.props.loading}
          empty={<Empty text={"No KYC Record to Show"} />}
        />
      </div>
    );
  }
}

const KYC_STATUS_APPROVED = "APPROVED";
const kycReason = {
  AML_FAILED: "AML_FAILED",
  UNSUPPORTED_ID_TYPE: "UNSUPPORTED_ID_TYPE",
  UNSUPPORTED_ID_COUNTRY: "UNSUPPORTED_ID_COUNTRY",
  MANIPULATED_DOCUMENT: "MANIPULATED_DOCUMENT",
  PHOTO_MISMATCH: "PHOTO_MISMATCH",
  PUNCHED_DOCUMENT: "PUNCHED_DOCUMENT",
  MISMATCH_PRINTED_BARCODE_DATA: "MISMATCH_PRINTED_BARCODE_DATA",
  NOT_ORIGINAL_DOC: "NOT_ORIGINAL_DOC",
  NOT_READABLE_DOCUMENT: "NOT_READABLE_DOCUMENT",
  MISSING_PART_DOCUMENT: "MISSING_PART_DOCUMENT",
  NO_DOCUMENT: "NO_DOCUMENT",
  CAMERA_BLACK_WHITE: "CAMERA_BLACK_WHITE",
  NOT_VALID_DUCUMENT: "NOT_VALID_DUCUMENT",
  WRONG_DOCUMENT_PAGE: "WRONG_DOCUMENT_PAGE",
  DIFFERENT_PERSONS_SHOWN: "DIFFERENT_PERSONS_SHOWN"
};

class InspectResult extends PureComponent {
  state = {
    AML_FAILED: false,
    UNSUPPORTED_ID_TYPE: false,
    UNSUPPORTED_ID_COUNTRY: false,
    MANIPULATED_DOCUMENT: false,
    PHOTO_MISMATCH: false,
    PUNCHED_DOCUMENT: false,
    MISMATCH_PRINTED_BARCODE_DATA: false,
    NOT_ORIGINAL_DOC: false,
    NOT_READABLE_DOCUMENT: false,
    MISSING_PART_DOCUMENT: false,
    NO_DOCUMENT: false,
    CAMERA_BLACK_WHITE: false,
    NOT_VALID_DUCUMENT: false,
    WRONG_DOCUMENT_PAGE: false,
    DIFFERENT_PERSONS_SHOWN: false,
    APPROVED: false,
    showPop: false
  };

  handleChange = name => event => {
    const checked = event.target.checked;
    if (name === KYC_STATUS_APPROVED) {
      if (checked) {
        for (let [kyc, value] of Object.entries(kycReason)) {
          this.setState({ [value]: false });
        }
      }
    } else if (checked) {
      this.setState({ [KYC_STATUS_APPROVED]: false });
    }
    this.setState({ [name]: checked });
  };

  Checkbox = props => {
    return (
      <div>
        <input
          type="checkbox"
          checked={props.status}
          onChange={this.handleChange(props.name)}
        />
        <label>{props.name}</label>
      </div>
    );
  };

  onClickSubmit = async (userId, createTime, message) => {
    let params = {
      userId,
      createTime,
      status: this.state.APPROVED ? "APPROVED" : "DENIED",
      message: message
    };
    await actions.kyc.kycStatusUpdate(params);
    actions.routing.push(
      `/kycInspection?userId=${userId}&createTime=${createTime}&inspect=false`
    );
  };

  onClickCancel = () => {
    this.setState({ showPop: false });
  };

  getMessage = () => {
    if (this.state.APPROVED) {
      return "APPROVED";
    }
    let message = [];
    const entries = Object.entries(this.state);
    for (var i = 0; i < entries.length - 2; i++) {
      if (entries[i][1]) {
        message.push(entries[i][0]);
      }
    }
    return message.join(",");
  };

  render() {
    const {
      AML_FAILED,
      UNSUPPORTED_ID_TYPE,
      UNSUPPORTED_ID_COUNTRY,
      MANIPULATED_DOCUMENT,
      PHOTO_MISMATCH,
      PUNCHED_DOCUMENT,
      MISMATCH_PRINTED_BARCODE_DATA,
      NOT_ORIGINAL_DOC,
      NOT_READABLE_DOCUMENT,
      MISSING_PART_DOCUMENT,
      NO_DOCUMENT,
      CAMERA_BLACK_WHITE,
      NOT_VALID_DUCUMENT,
      WRONG_DOCUMENT_PAGE,
      DIFFERENT_PERSONS_SHOWN,
      APPROVED,
      showPop
    } = this.state;
    const { userId, createTime } = this.props;
    const decided =
      APPROVED ||
      AML_FAILED ||
      UNSUPPORTED_ID_TYPE ||
      UNSUPPORTED_ID_COUNTRY ||
      MANIPULATED_DOCUMENT ||
      PHOTO_MISMATCH ||
      PUNCHED_DOCUMENT ||
      MISMATCH_PRINTED_BARCODE_DATA ||
      NOT_ORIGINAL_DOC ||
      NOT_READABLE_DOCUMENT ||
      MISSING_PART_DOCUMENT ||
      NO_DOCUMENT ||
      CAMERA_BLACK_WHITE ||
      NOT_VALID_DUCUMENT ||
      WRONG_DOCUMENT_PAGE ||
      DIFFERENT_PERSONS_SHOWN;
    const message = this.getMessage();

    return (
      <div className="resWrap commonWrap">
        <div className="title">Inspection Result</div>
        <div className="content">
          <div className="approve">
            Approve
            {this.Checkbox({ name: KYC_STATUS_APPROVED, status: APPROVED })}
          </div>
          <div className="reject">
            Reject
            {this.Checkbox({ name: kycReason.AML_FAILED, status: AML_FAILED })}
            {this.Checkbox({
              name: kycReason.UNSUPPORTED_ID_TYPE,
              status: UNSUPPORTED_ID_TYPE
            })}
            {this.Checkbox({
              name: kycReason.UNSUPPORTED_ID_COUNTRY,
              status: UNSUPPORTED_ID_COUNTRY
            })}
            {this.Checkbox({
              name: kycReason.MANIPULATED_DOCUMENT,
              status: MANIPULATED_DOCUMENT
            })}
            {this.Checkbox({
              name: kycReason.PHOTO_MISMATCH,
              status: PHOTO_MISMATCH
            })}
            {this.Checkbox({
              name: kycReason.PUNCHED_DOCUMENT,
              status: PUNCHED_DOCUMENT
            })}
            {this.Checkbox({
              name: kycReason.MISMATCH_PRINTED_BARCODE_DATA,
              status: MISMATCH_PRINTED_BARCODE_DATA
            })}
            {this.Checkbox({
              name: kycReason.NOT_ORIGINAL_DOC,
              status: NOT_ORIGINAL_DOC
            })}
            {this.Checkbox({
              name: kycReason.NOT_READABLE_DOCUMENT,
              status: NOT_READABLE_DOCUMENT
            })}
            {this.Checkbox({
              name: kycReason.MISSING_PART_DOCUMENT,
              status: MISSING_PART_DOCUMENT
            })}
            {this.Checkbox({
              name: kycReason.NO_DOCUMENT,
              status: NO_DOCUMENT
            })}
            {this.Checkbox({
              name: kycReason.CAMERA_BLACK_WHITE,
              status: CAMERA_BLACK_WHITE
            })}
            {this.Checkbox({
              name: kycReason.NOT_VALID_DUCUMENT,
              status: NOT_VALID_DUCUMENT
            })}
            {this.Checkbox({
              name: kycReason.WRONG_DOCUMENT_PAGE,
              status: WRONG_DOCUMENT_PAGE
            })}
            {this.Checkbox({
              name: kycReason.DIFFERENT_PERSONS_SHOWN,
              status: DIFFERENT_PERSONS_SHOWN
            })}
          </div>
          <button
            onClick={() => this.setState({ showPop: true })}
            disabled={!decided}
          >
            Submit
          </button>
          {showPop ? (
            <Popup
              onClickSubmit={() =>
                this.onClickSubmit(userId, createTime, message)
              }
              onClickCancel={this.onClickCancel}
            >
              <div className="warning">
                {APPROVED
                  ? "Are you sure you want to accept the kyc?"
                  : "Are you sure you want to submit the review with the following reasons?"}
              </div>
              {AML_FAILED && <li>{kycReason.AML_FAILED}</li>}
              {UNSUPPORTED_ID_TYPE && <li>{kycReason.UNSUPPORTED_ID_TYPE}</li>}
              {UNSUPPORTED_ID_COUNTRY && (
                <li>{kycReason.UNSUPPORTED_ID_COUNTRY}</li>
              )}
              {MANIPULATED_DOCUMENT && (
                <li>{kycReason.MANIPULATED_DOCUMENT}</li>
              )}
              {PHOTO_MISMATCH && <li>{kycReason.PHOTO_MISMATCH}</li>}
              {PUNCHED_DOCUMENT && <li>{kycReason.PUNCHED_DOCUMENT}</li>}
              {MISMATCH_PRINTED_BARCODE_DATA && (
                <li>{kycReason.MISMATCH_PRINTED_BARCODE_DATA}</li>
              )}
              {NOT_ORIGINAL_DOC && <li>{kycReason.NOT_ORIGINAL_DOC}</li>}
              {NOT_READABLE_DOCUMENT && (
                <li>{kycReason.NOT_READABLE_DOCUMENT}</li>
              )}
              {MISSING_PART_DOCUMENT && (
                <li>{kycReason.MISSING_PART_DOCUMENT}</li>
              )}
              {NO_DOCUMENT && <li>{kycReason.NO_DOCUMENT}</li>}
              {CAMERA_BLACK_WHITE && <li>{kycReason.CAMERA_BLACK_WHITE}</li>}
              {NOT_VALID_DUCUMENT && <li>{kycReason.NOT_VALID_DUCUMENT}</li>}
              {WRONG_DOCUMENT_PAGE && <li>{kycReason.WRONG_DOCUMENT_PAGE}</li>}
              {DIFFERENT_PERSONS_SHOWN && (
                <li>{kycReason.DIFFERENT_PERSONS_SHOWN}</li>
              )}
            </Popup>
          ) : (
            ""
          )}
        </div>
      </div>
    );
  }
}

class KYCInspection extends PureComponent {
  render() {
    const {
      kycInfo,
      reviewHistory,
      inspect,
      userId,
      createTime,
      loading,
      frontImage,
      backImage,
      humanImage
    } = this.props;
    return (
      <div className="inspectionWrap">
        <KYCInfo
          kycInfo={kycInfo}
          frontImage={frontImage}
          backImage={backImage}
          humanImage={humanImage}
          loading={loading}
        />
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
