import React, { PureComponent } from "react";
import { actions } from "mirrorx";
import { Button, Table, Input, Popconfirm, Modal, Radio } from "antd";
import editableComponent from "Components/EditableTable";
import "Biz/Inspection.less";

const handleDelete = row => {
  actions.rateLimit.deleteRateLimit({
    category: row.category,
    entity: row.entity
  });
};

const handleAddRateLimit = (category, entity) => {
  let newRow = {
    category: category,
    entity: entity,
    bypassIpCheck: false,
    rateLimits: `:default`
  };
  handleSave(newRow);
};

const handleSave = row => {
  actions.rateLimit.updateRateLimit(row);
};

const columns = [
  {
    title: "Category",
    dataIndex: "category",
    key: "category"
  },
  {
    title: "Entity",
    dataIndex: "entity",
    key: "entity"
  },
  {
    title: "Bypass IP Check",
    dataIndex: "bypassIpCheck",
    key: "bypassIpCheck",
    editable: true,
    render: (text, item) => {
      return text ? (
        <div style={{ color: "green" }}>true</div>
      ) : (
        <div style={{ color: "red" }}>false</div>
      );
    }
  },
  {
    title: "Rate Limit",
    dataIndex: "rateLimits",
    key: "rateLimits",
    editable: true
  },
  {
    title: "Operation",
    dataIndex: "operation",
    render: (text, record) => (
      <Popconfirm
        title="Sure to delete?"
        onConfirm={() => handleDelete(record)}
      >
        <a href="javascript:;">Delete</a>
      </Popconfirm>
    )
  }
];

class RateLimit extends PureComponent {
  state = {
    rateLimit: "user_rate_limit",
    showModal: false,
    entity: ""
  };

  onChangeRateLimit = e => {
    this.setState({
      rateLimit: e.target.value
    });
  };

  onChangeEntity = e => {
    this.setState({
      entity: e.target.value
    });
  };

  handleAddRateLimit = () => {
    const { rateLimit, entity } = this.state;
    handleAddRateLimit(rateLimit, entity);
    this.setState({ showModal: false });
  };

  render() {
    const { list, loading } = this.props.rateLimit;

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
        <span>
          <Button
            onClick={() => {
              this.setState({ showModal: true });
            }}
            type="primary"
            style={{ marginBottom: 15 }}
          >
            Add a rate limit
          </Button>
        </span>
        <Modal
          title="Which rate limit do you want to add?"
          visible={this.state.showModal}
          onOk={this.handleAddRateLimit}
          onCancel={() => {
            this.setState({ showModal: false });
          }}
        >
          <Radio.Group
            onChange={this.onChangeRateLimit}
            value={this.state.rateLimit}
          >
            <Radio value={"user_rate_limit"}>User Rate Limit</Radio>
            <Radio value={"ip_rate_limit"}>Ip Rate Limit</Radio>
          </Radio.Group>
          <div style={{ marginTop: 20 }}>
            Entity: <Input onChange={this.onChangeEntity} />{" "}
          </div>
        </Modal>
        <Table
          rowKey={item => item.category + item.entity}
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

export default RateLimit;
