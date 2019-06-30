import { actions } from "mirrorx";
import APIService from "Service/APIService";
import moment from "moment";
import { truncateToDate } from "Utils/index";
const dateFormat = "MM/DD/YYYY";

export default {
  name: "tradingStatistics",
  initialState: {
    loading: false,
    tradingData: null
  },
  reducers: {
    updateData(state, data) {
      return { ...state, ...data };
    }
  },
  effects: {
    async fetchTradingData(data, getState) {
      actions.tradingStatistics.updateData({ loading: true });
      let startTime, endTime, timeZone;
      if (!data || !data.hasOwnProperty("timeZone")) {
        timeZone = "UTC";
      } else {
        timeZone = data.timeZone;
      }
      if (!data || !data.hasOwnProperty("startTime")) {
        startTime = moment().tz(timeZone).startOf('day').subtract(6, "d");
      } else {
        startTime = data.startTime;
      }
      if (!data || !data.hasOwnProperty("endTime")) {
        endTime = moment().tz(timeZone).startOf('day').add(1, "d");
      } else {
        endTime = data.endTime;
      }
      const result = await APIService.request("get", "/statistics/trading", {
        startTime: startTime.unix(),
        endTime: endTime.unix(),
        period: "daily",
        timeZone: timeZone
      });
      let tradingData = [];
      if (!result.error) {
        tradingData = result;
      }
      actions.tradingStatistics.updateData({
        loading: false,
        tradingData: tradingData
      });
    }
  }
};
