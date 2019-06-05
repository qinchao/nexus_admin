import React from "react";
import { Form, Select, Spin, Row, Col, Input, Button, message, Icon } from "antd";
import { actions } from "mirrorx";
import { ConfigPageTemplate } from "./ConfigPageTemplate";
import { getRawJsonStrFromPretty } from "../../utils/index";
const { Option } = Select;

class GlobalConfig extends ConfigPageTemplate {

  constructor(props) {
    super(props);
    this.KeyOfNewConfigCategory = "__$newConfig";
    this.updateModelData = actions.globalConfig.updateData;
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let toUpdateConfig = getRawJsonStrFromPretty(values["inputConfig"]);
        let toUpdateCategory = null;
        if (values.hasOwnProperty("inputCategory")) {
          toUpdateCategory = values["inputCategory"];
        } else {
          const {currentCategory} = this.props.globalConfig;
          toUpdateCategory = currentCategory;
        }
        actions.globalConfig.putNewGlobalConfig({category:toUpdateCategory, config:toUpdateConfig});
        message.success("Your submission has been received. The server may need some time (about 15 seconds) to update data. Use reset button to check if date has been updated", 5);
        actions.globalConfig.updateData({submittable: false});
      } else {
        console.log('form errors. skip submit');
      }
    });
  };

  handleCategoryChange = (category) => {
    actions.globalConfig.updateData({currentCategory: category});
    this.props.form.resetFields();
    actions.globalConfig.updateData({submittable: false});
  };

  handleReset = (event) => {
    actions.globalConfig.fetchGlobalConfig(false);
    this.props.form.resetFields();
    actions.globalConfig.updateData({submittable: false});
  };

  handleInputCategoryCheck = (rule, value, callback) => {
    callback();
    this.checkIfSubmittable();
  };

  // override parent method since we also need to check inputCategory
  handleInputConfigCheck = (rule, value, callback) => {
    try {
      JSON.parse(value);
    } catch (e) {
      callback('Invalid JSON format');
      actions.globalConfig.updateData({submittable: false});
      return;
    }
    callback();
    this.checkIfSubmittable();
  };

  checkIfSubmittable = ()=> {
    let checkResult = this.props.form.getFieldsError(["inputConfig", "inputCategory"]);
    for (let field in checkResult) {
      if (typeof checkResult[field] !== 'undefined') {
        actions.globalConfig.updateData({submittable: false});
        return;
      }
    }
    if(JSON.stringify(this.getSelectedConfig()) === getRawJsonStrFromPretty(this.props.form.getFieldValue("inputConfig"))) {
      actions.globalConfig.updateData({submittable: false});
      return;
    }
    actions.globalConfig.updateData({submittable: true});
  };

  getSelectedConfig = () => {
    const { currentCategory, allConfigs } = this.props.globalConfig;
    return allConfigs[currentCategory];
  };

  render() {
    const { allConfigs, loading, currentCategory, submittable } = this.props.globalConfig;
    const { getFieldDecorator } = this.props.form;
    let initialInput = "{}";
    if (allConfigs && currentCategory !== this.KeyOfNewConfigCategory) {
      initialInput = JSON.stringify(allConfigs[currentCategory], null, 2);
    }
    let inputArea = this.textAreaTemplate(false, initialInput);
    return (
      <div>
        <Spin spinning={loading}>
          <Form onSubmit={this.handleSubmit}>
            <Row gutter={24}>
              <Col span={12}>
                <Select value={currentCategory} span={6} onChange={this.handleCategoryChange}>
                  {Object.keys(allConfigs || {}).map(x => (
                    <Option key={x}>{x}</Option>
                  ))}
                  <Option key={this.KeyOfNewConfigCategory}><Icon type="plus"/> Add new Config</Option>
                </Select>
              </Col>
              <Col span={12}>
                <Button type="primary" htmlType={"submit"} disabled={!submittable}>
                  Submit
                </Button>
                <Button style={{marginLeft: 8}} onClick={this.handleReset}>
                  Reset
                </Button>
              </Col>
            </Row>
            <Form.Item>
              {
                currentCategory === this.KeyOfNewConfigCategory &&
                getFieldDecorator('inputCategory', {
                  rules: [
                    { required: true, message: 'Please input category Name!' },
                    { validator: this.handleInputCategoryCheck }
                  ],
                  initialValue: "",
                })(<Input style={{ marginTop: "20px" }} placeholder={"new category name"}/>)
              }
            </Form.Item>
            {inputArea}
          </Form>

        </Spin>
      </div>
    )
  }
}

const GlobalConfigForm = Form.create({ name: "global_config" })(GlobalConfig);

export default GlobalConfigForm;
