import { actions } from "mirrorx";
import APIService from "Service/APIService";
import {dateStrWithTimezoneToUnix} from "Utils/index.js"

export default {
  name: "glueJob",
  initialState: {
    loading: false,
    jobStatus: {},
  },
  reducers: {
    updateData(state, data) {
      return { ...state, ...data };
    }
  },
  effects: {
    async fetchGlueJobData(data, getState) {
      actions.glueJob.updateData({ loading: true });
      const result = await APIService.request("get", "/etl/jobs", {});
      let jobStatus = {};
      if (!result.error && result.hasOwnProperty("jobsByRoot")) {
        jobStatus = result.jobsByRoot;
      }
      actions.glueJob.updateData({
        loading: false,
        jobStatus: jobStatus,
      });
    }
  }
};
