import React, { PureComponent } from "react";
import { Form, Select, Spin, Row, Col, Input, Button, message, Icon } from "antd";
import { actions } from "mirrorx";

const { Option } = Select;
const { TextArea } = Input;

const IdToCurrency = [
  "USDT",
  "PAX",
  "USDC",
  "BTC",
  "ETH",
  "AE",
  "BAT",
  "BCHABC",
  "BCHSV",
  "BNB",
  "DASH",
  "DCR",
  "EOS",
  "ETC",
  "IOST",
  "KNC",
  "LTC",
  "NEO",
  "OMG",
  "ONT",
  "TRX",
  "VET",
  "XRP",
  "XZC",
  "ZEC",
  "ZRX",
  "FORUNITTEST",
  "BTCSO",
  "USDSO",
];

class ConfigPageTemplate extends PureComponent {

  getRawJsonFromPretty = (prettyJson) => {
    try {
      let obj = JSON.parse(prettyJson);
      return JSON.stringify(obj);
    } catch (e) {
      return "";
    }
  };

  handleReset = () => {
    this.pullNewestData();
    this.props.form.resetFields();
    this.checkContentModified();
  };

  checkContentModified = () => {
    if(JSON.stringify(this.getSelectedConfig()) === this.getRawJsonFromPretty(this.props.form.getFieldValue("inputConfig"))) {
      this.updateModelData({submittable: false});
      return;
    }
    this.updateModelData({submittable: true});
  };

  handleInputConfigCheck = (rule, value, callback) => {
    try {
      JSON.parse(value);
    } catch (e) {
      callback('Invalid JSON format');
      this.updateModelData({submittable: false});
      return;
    }
    callback();
    this.checkContentModified();
  };

  textAreaTemplate = (disableTextArea, initialValue) =>{
    const { getFieldDecorator } = this.props.form;
    return(
      <Form.Item>
        {
          getFieldDecorator('inputConfig', {
            rules: [
              { required: true, message: 'Please input Config Detail!' },
              { validator: this.handleInputConfigCheck}
            ],
            initialValue: initialValue,
            getValueFromEvent: e => {
              return e.target.value;
            },
          })(<TextArea rows={30}  disabled={disableTextArea}/>)
        }
      </Form.Item>
    );
  }
}

export { ConfigPageTemplate, IdToCurrency };