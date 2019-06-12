import React, { PureComponent } from "react";
import { actions } from "mirrorx";
import { Button, Table, Input, Form } from "antd";
import editableComponent from "Components/EditableTable";
import "Biz/Inspection.less";

const handleSave = row => {
  actions.apiResourceCost.updateApiResourceCost(row);
};

const columns = [
  {
    title: "Entity",
    dataIndex: "entity",
    key: "entity"
  },
  {
    title: "Resource Cost",
    dataIndex: "resourceCost",
    key: "resourceCost",
    editable: true
  }
];

class APIResourceCost extends PureComponent {
  handleSearch = e => {
    e.preventDefault();

    this.props.form.validateFields((err, values) => {
      const { entitySearch } = values;
      actions.apiResourceCost.searchEntity(entitySearch);
    });
  };

  handleReset = () => {
    this.props.form.resetFields();
    actions.apiResourceCost.fetchApiResourceCosts();
  };

  handleAdd = e => {
    e.preventDefault();

    this.props.form.validateFields((err, values) => {
      const { entityAdd, resourceCost } = values;
      handleSave({ entity: entityAdd, resourceCost });
      this.handleReset();
    });
  };

  render() {
    const { list, loading } = this.props.apiResourceCost;
    const { getFieldDecorator } = this.props.form;

    const columnsWithCell = columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: handleSave
        })
      };
    });

    return (
      <div className="panelBox">
        <Form
          layout="inline"
          onSubmit={this.handleSearch}
          style={{ marginBottom: 15 }}
        >
          <Form.Item label="Entity">
            {getFieldDecorator("entitySearch")(<Input maxLength={50} />)}
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Search
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
              Reset
            </Button>
          </Form.Item>
          <Form.Item label="Entity">
            {getFieldDecorator("entityAdd")(<Input maxLength={50} />)}
          </Form.Item>
          <Form.Item label="Resource Cost">
            {getFieldDecorator("resourceCost")(<Input maxLength={50} />)}
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={this.handleAdd}>
              Add
            </Button>
          </Form.Item>
        </Form>

        <Table
          rowKey={item => item.entity}
          columns={columnsWithCell}
          dataSource={list}
          loading={loading}
          components={editableComponent}
          rowClassName="editable-row"
          bordered
        />
      </div>
    );
  }
}

const APIResourceCostList = Form.create({ name: "api_resource_cost_search" })(
  APIResourceCost
);

export default APIResourceCostList;
