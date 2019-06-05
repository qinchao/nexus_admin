import React, { PureComponent } from "react";
import { Form, Select, Spin, Row, Col, Input, Button, message, Icon } from "antd";
import { ConfigPageTemplate, IdToCurrency } from "./ConfigPageTemplate";
import { actions } from "mirrorx";

const { Option } = Select;
const { TextArea } = Input;

class CurrencyConfig extends ConfigPageTemplate {

  constructor(props) {
    super(props);
    this.updateModelData = actions.currencyConfig.updateData;
    this.pullNewestData = actions.currencyConfig.fetchCurrencyConfig;
  }

  handleSubmit = (e) => {
    e.preventDefault();
    let toUpdateConfig = JSON.parse(this.props.form.getFieldValue("inputConfig"));
    actions.currencyConfig.submitCurrencyConfig({currencyConfig: toUpdateConfig});
    message.success("Your submission has been received.", 3);
    actions.currencyConfig.updateData({submittable: false});
    actions.currencyConfig.fetchCurrencyConfig();
  };


  handleCurrencyChanged = (value) => {
    this.updateModelData({selectedCurrency: Number(value)});
    this.handleReset();
  };

  getSelectedConfig = () => {
    const { innerCurrencies, selectedCurrency} = this.props.currencyConfig;
    let selectedInnerCurrency = innerCurrencies.get(selectedCurrency);
    return selectedInnerCurrency;
  };

  render() {
    const { innerCurrencies, loading, selectedCurrency, submittable } = this.props.currencyConfig;
    let initialText = "";
    if (innerCurrencies) {
      initialText = JSON.stringify(innerCurrencies.get(selectedCurrency), null, 2);
    }
    let inputArea = this.textAreaTemplate(innerCurrencies && !innerCurrencies.has(selectedCurrency), initialText);
    return (
      <div>
        <Spin spinning={loading}>
          <Form onSubmit={this.handleSubmit.bind(this)}>
            <Row gutter={24}>
              <Col span={12}>
                <span>Currency:</span>
                <br/>
                <Form.Item>
                  <Select value={selectedCurrency ? selectedCurrency.toString() : ""} onChange={this.handleCurrencyChanged.bind(this)} disabled={false}>
                    {[...(innerCurrencies || new Map()).keys()].map(x => (
                      <Option key={x}>
                        {x - 1 < IdToCurrency.length ? IdToCurrency[x-1] : "UnknownCurrencyId:" + x}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <br/>
                <Button type="primary" htmlType={"submit"} disabled={!submittable}>
                  Submit
                </Button>
                <Button style={{marginLeft: 8}} onClick={this.handleReset.bind(this)}>
                  Reset
                </Button>
              </Col>
            </Row>
          </Form>
          {inputArea}
        </Spin>
      </div>
    );
  }

}

const CurrencyConfigForm = Form.create({ name: "currency_config" })(CurrencyConfig);

export default CurrencyConfigForm;