import React from "react";
import {Button, Col, Form, Icon, message, Row, Select, Spin} from "antd";
import { ConfigPageTemplate } from "./ConfigPageTemplate";
import { actions } from "mirrorx";
const { Option } = Select;

class CurrencyConfig extends ConfigPageTemplate {

  constructor(props) {
    super(props);
    this.KeyOfNewConfigCategory = -1;
    this.updateModelData = actions.currencyConfig.updateData;
    this.pullNewestData = actions.currencyConfig.fetchCurrencyConfig;
  }

  async handleSubmit(e) {
    e.preventDefault();
    let toUpdateConfig = JSON.parse(this.props.form.getFieldValue("inputConfig"));
    message.success("Your submission has been received.", 3);
    actions.currencyConfig.updateData({submittable: false});
    await actions.currencyConfig.submitCurrencyConfig({currencyConfig: toUpdateConfig});
    await actions.currencyConfig.fetchCurrencyConfig();
  };


  handleCurrencyChanged = (value) => {
    this.updateModelData({selectedCurrency: Number(value)});
    this.handleReset();
  };

  getSelectedConfig = () => {
    const { innerCurrencies, selectedCurrency} = this.props.currencyConfig;
    return innerCurrencies.get(selectedCurrency);
  };

  render() {
    const { innerCurrencies, loading, selectedCurrency, submittable, idToCurrency } = this.props.currencyConfig;
    this.idToCurrency = idToCurrency;
    let initialText = "";
    if (innerCurrencies && innerCurrencies.has(selectedCurrency)) {
      initialText = JSON.stringify(innerCurrencies.get(selectedCurrency), null, 2);
    }
    return (
      <div>
        <Spin spinning={loading}>
          <Form onSubmit={this.handleSubmit.bind(this)}>
            <Row gutter={24}>
              <Col span={12}>
                <span>Currency:</span>
                <br/>
                <Form.Item>
                  <Select value={selectedCurrency ? selectedCurrency.toString() : ""} onChange={this.handleCurrencyChanged.bind(this)}>
                    {[...(innerCurrencies || new Map()).keys()].map(
                      x => this.currencyOptionTemplate(x))}
                    <Option key={this.KeyOfNewConfigCategory}><Icon type="plus"/> Add New Config</Option>
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
          {this.textAreaTemplate(
            innerCurrencies &&
            selectedCurrency !== this.KeyOfNewConfigCategory &&
            !innerCurrencies.has(selectedCurrency),
            initialText)}
        </Spin>
      </div>
    );
  }

}

const CurrencyConfigForm = Form.create({ name: "currency_config" })(CurrencyConfig);

export default CurrencyConfigForm;
