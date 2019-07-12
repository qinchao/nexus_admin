import React, {PureComponent} from "react";
import { Form, Steps, Icon, Card } from 'antd';
import {actions} from "mirrorx";
import moment from "moment";

const { Step } = Steps;

const jobStatusToStepStatus = {
  "running": "process",
  "fail": "error",
  "success": "finish",
};

class GlueJob extends PureComponent {
  constructor(props) {
    super(props);
  }

  jobStepTemplate = (jobStatus) => {
    const description = <div>
      start time:<br/>{moment.unix(jobStatus.startTime).format("MM/DD hh:mm:ss")} <br/>
      end time:<br/>{moment.unix(jobStatus.endTime).format("MM/DD hh:mm:ss")} <br/>
    </div>;
    return(<Step
      key={jobStatus.name}
      title={jobStatus.name}
      description={description}
      icon={jobStatus.status === "running" && <Icon type="loading"/>}
    />)
  };

  jobStepsTemplate = (rootName, jobArray) => {
    const jobCount = jobArray.length;
    if (jobCount === 0) {
      return (<div>Empty</div>)
    }
    const rootJob = jobArray[0];
    return(
      <Card key={rootName} title={rootName} bordered={true} style={{ marginTop: 16 }} >
        <Steps current={jobCount - 2}
               status={jobStatusToStepStatus[rootJob.status]}
               key={rootName}
        >
          {jobArray.slice(1).map((jobStatus) => this.jobStepTemplate(jobStatus))}
          {
            rootJob.status === "running" && <Step key="__next" title={"Next Job"} description="unknown job status until reach"/>
          }
        </Steps>
      </Card>
    );
  };

  render() {
    const { loading, jobStatus } = this.props.glueJob;
    console.log("jobStatus: ", JSON.stringify(jobStatus,null,2));
    let allJobSteps = [];
    for (const rootName in jobStatus) {
      if (jobStatus.hasOwnProperty(rootName)) {
        allJobSteps.push(this.jobStepsTemplate(rootName, jobStatus[rootName]))
      }
    }
    return(
      <div>
        {loading && <Icon type={"loading"}/>}
        {!loading && allJobSteps}
      </div>
    );
  }
}

const GlueJobForm = Form.create({ name: "glue_job" })(
  GlueJob
);

export default GlueJobForm;
