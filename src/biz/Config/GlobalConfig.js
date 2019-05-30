import React, { PureComponent } from "react";
import { Form, Select, Spin, Row, Col, Input, Button, Icon } from "antd";
import { actions } from "mirrorx";

const { Option } = Select;
const { TextArea } = Input;

class GlobalConfig extends PureComponent {
  constructor(props) {
    super(props);
    // this.handleSearch = this.handleSearch.bind(this);
    // this.handleReset = this.handleReset.bind(this);
  }

  handleCategoryChange = (category)=>{
    const { allConfigs } = this.props.globalConfig;
    if (allConfigs && allConfigs.hasOwnProperty(category)) {
      actions.globalConfig.updateData({inputTextStr: JSON.stringify(allConfigs[category])});
    }
  };

  handleTextChange = (event)=>{
    actions.globalConfig.updateData({inputTextStr: event.target.value});
  };

  render() {
    console.log("props:", this.props);
    const { allConfigs, loading, inputTextStr } = this.props.globalConfig;
    console.log("allConfigs:", this.props.globalConfig.allConfigs);
    const categories = [];
    for (let category in allConfigs) {
      categories.push(<Option key={category}>{category}</Option>);
    }
    return (
      <div>
        <Spin spinning={loading}>
          <Form >
            <Col span={12}>
              <Select span={6} onChange={this.handleCategoryChange}>
                {categories}
              </Select>
            </Col>
            <Col span={12} style={{ textAlign: 'right' }}>
              <Button>
                Retrieve
              </Button>
              <Button>
                Submit
              </Button>
            </Col>
            <TextArea style={{ marginTop: "30px" }} rows={20} value={inputTextStr} onChange={this.handleTextChange}>

            </TextArea>
          </Form>

        </Spin>
      </div>
    )
  }
}

const GlobalConfigForm = Form.create({ name: "global_config" })(GlobalConfig);

export default GlobalConfigForm;