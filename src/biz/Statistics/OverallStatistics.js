import React, { PureComponent } from "react";
import {Form, Row, Col, Card} from "antd";
import {
  Chart,
  Geom,
  Axis,
  Tooltip,
  Legend,
} from "bizcharts";
import DataSet from "@antv/data-set";

const tradingByCurrencyScale = {
  percent: {
    min: 0,
    formatter(val) {
      return (val * 100).toFixed(2) + "%";
    }
  }
};

class OverallStatistics extends PureComponent {
  render() {
    const { loading, dnwData, tradingData, profitData, tradingDataByCurrency, periodInDay } = this.props.overallStatistics;
    const ds = new DataSet();
    const tradingCompositionDV = ds
      .createView()
      .source(tradingDataByCurrency)
      .transform({
        type: "percent",
        field: "amount",
        dimension: "currency",
        groupBy: ["date"],
        as: "percent"
      });
    return (
      <div>
        <Row gutter={32}>
          <Col span={12}>
            <Card title={`Trading Amount (${periodInDay} days)`} bordered={false} loading={loading}>
              <Chart height={400} data={tradingData} forceFit>
                <Legend />
                <Axis name="date" />
                <Axis
                  name="amount"
                  label={{
                    formatter: val => `${val} BTC`,
                  }}
                />
                <Tooltip
                  crosshairs={{
                    type: 'y',
                  }}
                />
                <Geom type="line" position="date*amount" size={2} />
                <Geom
                  type="point"
                  position="date*amount"
                  size={4}
                  shape={'circle'}
                  style={{
                    stroke: '#fff',
                    lineWidth: 1,
                  }}
                />
              </Chart>
            </Card>
          </Col>
          <Col span={12}>
            <Card title={`Trading Count (${periodInDay} days)`} bordered={false} loading={loading}>
              <Chart height={400} data={tradingData} forceFit>
                <Legend />
                <Axis name="date" />
                <Axis
                  name="count"
                  label={{
                    formatter: val => `${val}`,
                  }}
                />
                <Tooltip
                  crosshairs={{
                    type: 'y',
                  }}
                />
                <Geom type="line" position="date*count" size={2} />
                <Geom
                  type="point"
                  position="date*count"
                  size={4}
                  shape={'circle'}
                  style={{
                    stroke: '#fff',
                    lineWidth: 1,
                  }}
                />
              </Chart>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Card title={`Trading Composition (${periodInDay} days)`} bordered={false} loading={loading}>
              <Chart height={400}
                     data={tradingCompositionDV}
                     scale={tradingByCurrencyScale} forceFit>
                <Legend />
                <Axis name="date" />
                <Axis name="percent" />
                <Tooltip />
                <Geom
                  type="intervalStack"
                  position="date*percent"
                  color={"currency"}
                />
              </Chart>
            </Card>
          </Col>
        </Row>
        <Row gutter={32}>
          <Col span={12}>
            <Card title={`Deposit and Withdraw (${periodInDay} days)`} bordered={false} loading={loading}>
              <Chart height={400} data={dnwData} forceFit>
                <Legend />
                <Axis name="date" />
                <Axis
                  name="amount"
                  label={{
                    formatter: val => `${val} BTC`,
                  }}
                />
                <Tooltip
                  crosshairs={{
                    type: 'y',
                  }}
                />
                <Geom type="line" position="date*amount" size={2} color={'dnwType'} />
                <Geom
                  type="point"
                  position="date*amount"
                  size={4}
                  shape={'circle'}
                  color={'dnwType'}
                  style={{
                    stroke: '#fff',
                    lineWidth: 1,
                  }}
                />
              </Chart>
            </Card>
          </Col>
          <Col span={12}>
            <Card title={`Profit (${periodInDay} days)`} bordered={false} loading={loading}>
              <Chart height={400} data={profitData} forceFit>
                <Axis name="date" />
                <Axis name="amount" />
                <Tooltip
                  crosshairs={{
                    type: "y"
                  }}
                />
                <Geom type="line" position="date*amount" size={2} />
                <Geom
                  type="point"
                  position="date*amount"
                  size={4}
                  shape={"circle"}
                  style={{
                    stroke: "#fff",
                    lineWidth: 1
                  }}
                />
              </Chart>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

const OverallStatisticsForm = Form.create({ name: "overall_statistics" })(
  OverallStatistics
);

export default OverallStatisticsForm;
