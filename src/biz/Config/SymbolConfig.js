import React, { PureComponent } from "react";
import { Form, Select, Spin, Row, Col, Input, Button, message, Icon } from "antd";
import {ConfigPageTemplate, IdToCurrency} from "./ConfigPageTemplate";
import { actions } from "mirrorx";

const { Option } = Select;
const { TextArea } = Input;

class SymbolConfig extends ConfigPageTemplate {

  constructor(props) {
    super(props);
    this.updateModelData = actions.symbolConfig.updateData;
    this.pullNewestData = actions.symbolConfig.fetchSymbolConfig;
  }

  handleSubmit = e => {
    e.preventDefault();
    let toUpdateConfig = JSON.parse(this.props.form.getFieldValue("inputConfig"));
    actions.symbolConfig.submitSymbolConfig({symbolConfig: toUpdateConfig});
    message.success("Your submission has been received.", 3);
    actions.symbolConfig.updateData({submittable: false});
    actions.symbolConfig.fetchSymbolConfig();
  };

  handleBaseChanged = (value) =>{
    this.updateModelData({selectedBaseCurrency: Number(value)});
    this.handleReset();
  };

  handleQuoteChanged = (value) =>{
    let selectedQuoteCurrency = Number(value);
    const {quoteBaseSymbol, selectedBaseCurrency} =  this.props.symbolConfig;
    this.updateModelData({selectedQuoteCurrency: selectedQuoteCurrency});
    let filteredBaseCurrency = [];
    let selectedSymbol = this.getInnerSymbol(selectedBaseCurrency, selectedQuoteCurrency);
    if (selectedQuoteCurrency) {
      filteredBaseCurrency = [...quoteBaseSymbol.get(selectedQuoteCurrency).keys()];
      if (selectedSymbol == null) {
        actions.symbolConfig.updateData({selectedBaseCurrency: Number(filteredBaseCurrency[0])});
      }
    }
    this.handleReset();
  };

  getSelectedConfig = () => {
    const { selectedBaseCurrency, selectedQuoteCurrency } = this.props.symbolConfig;
    return this.getInnerSymbol(selectedBaseCurrency, selectedQuoteCurrency);
  };

  getInnerSymbol = (selectedBaseCurrency, selectedQuoteCurrency) => {
    const { quoteBaseSymbol} = this.props.symbolConfig;
    if (selectedBaseCurrency && selectedQuoteCurrency) {
      let lookupSymbol = quoteBaseSymbol.get(selectedQuoteCurrency);
      if (lookupSymbol && lookupSymbol.has(selectedBaseCurrency)) {
        return lookupSymbol.get(selectedBaseCurrency);
      }
      return null;
    }
  };

  render() {
    const { innerSymbols, loading, quoteBaseSymbol,
      selectedBaseCurrency, selectedQuoteCurrency, submittable} = this.props.symbolConfig;
    let initialText = "";
    let selectedSymbol = this.getInnerSymbol(selectedBaseCurrency, selectedQuoteCurrency);
    if (selectedSymbol) {
      initialText = JSON.stringify(selectedSymbol, null, 2);
    }
    let filteredBaseCurrency = [];
    if (selectedQuoteCurrency) {
      filteredBaseCurrency = [...quoteBaseSymbol.get(selectedQuoteCurrency).keys()];
    }
    let inputArea = this.textAreaTemplate(selectedSymbol == null, initialText);
    return (
      <div>
        <Spin spinning={loading}>
          <Form onSubmit={this.handleSubmit.bind(this)}>
            <Row gutter={24}>
              <Col span={6}>
                <span>Base Currency:</span>
                <br/>
                <Form.Item>
                  {
                  <Select value={selectedBaseCurrency? selectedBaseCurrency.toString():""} onChange={this.handleBaseChanged.bind(this)} disabled={!selectedQuoteCurrency}>
                    {filteredBaseCurrency.map(x => (
                      <Option key={x}>
                        {x - 1 < IdToCurrency.length ? IdToCurrency[x-1] : "UnknownCurrencyId:" + x}
                      </Option>
                    ))}
                  </Select>}
                </Form.Item>
              </Col>
              <Col span={6}>
                <b>*Quote Currency:</b>
                <br/>
                <Form.Item>
                  {quoteBaseSymbol &&
                  <Select value={selectedQuoteCurrency? selectedQuoteCurrency.toString():""} onChange={this.handleQuoteChanged.bind(this)}>
                    {[...quoteBaseSymbol.keys()].map(x => (
                      <Option key={x}>{IdToCurrency[x-1]}</Option>
                    ))}
                  </Select>}
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

const SymbolConfigForm = Form.create({ name: "symbol_config" })(SymbolConfig);

export default SymbolConfigForm;