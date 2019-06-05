import React, { PureComponent } from "react";
import { Form, Select, Spin, Row, Col, Input, Button, message, Icon } from "antd";
import { actions } from "mirrorx";

const { Option } = Select;
const { TextArea } = Input;

class GlobalConfig extends PureComponent {

  constructor(props) {
    super(props);
    this.KeyOfNewConfigCategory = "__$newConfig";
  }

  getRawJsonFromPretty = (prettyJson) => {
    try {
      let obj = JSON.parse(prettyJson);
      return JSON.stringify(obj);
    } catch (e) {
      return "";
    }
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let toUpdateConfig = this.getRawJsonFromPretty(values["inputConfig"]);
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
    const { currentCategory, allConfigs } = this.props.globalConfig;
    // non-submittable if nothing modified
    if(JSON.stringify(allConfigs[currentCategory]) === this.getRawJsonFromPretty(this.props.form.getFieldValue("inputConfig"))) {
      actions.globalConfig.updateData({submittable: false});
      return;
    }
    actions.globalConfig.updateData({submittable: true});
  };

  render() {
    const { allConfigs, loading, inputTextStr, currentCategory, submittable } = this.props.globalConfig;
    const { getFieldDecorator } = this.props.form;
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
            <Form.Item>
              {
                getFieldDecorator('inputConfig', {
                  rules: [
                    { required: true, message: 'Please input Config Detail!' },
                    { validator: this.handleInputConfigCheck}
                  ],
                  initialValue: allConfigs && currentCategory !== this.KeyOfNewConfigCategory ?
                    JSON.stringify(allConfigs[currentCategory], null, 2) : "{}",
                  getValueFromEvent: e=>{
                    return e.target.value;
                  },
                })(<TextArea rows={20} />)
              }
            </Form.Item>
          </Form>

        </Spin>
      </div>
    )
  }
}

const GlobalConfigForm = Form.create({ name: "global_config" })(GlobalConfig);

export default GlobalConfigForm;