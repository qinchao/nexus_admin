import React, { PureComponent } from "react";
import { Form, Input, Select } from "antd";
import { getRawJsonStrFromPretty } from "../../utils/index";
const { TextArea } = Input;
const { Option } = Select;
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

  handleReset = () => {
    this.pullNewestData();
    this.props.form.resetFields();
    this.checkContentModified();
  };

  checkContentModified = () => {
    if(JSON.stringify(this.getSelectedConfig()) === getRawJsonStrFromPretty(this.props.form.getFieldValue("inputConfig"))) {
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

  // currency id => option along with currency name
  currencyOptionTemplate = (x) => {
    return(
      <Option key={x}>
        {x - 1 < IdToCurrency.length ?
          IdToCurrency[x-1] :
          "UnknownCurrencyId:" + x}
      </Option>
    )
  }
}

export { ConfigPageTemplate, IdToCurrency };
