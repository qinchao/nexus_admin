import { actions } from "mirrorx";
import APIService from "Service/APIService";
import {dateStrWithTimezoneToUnix} from "Utils/index.js"

export default {
  name: "depositStatistics",
  initialState: {
    loading: false,
    depositData: null,
  },
  reducers: {
    updateData(state, data) {
      return { ...state, ...data };
    }
  },
  effects: {
    async fetchDnwData(data, getState) {
      actions.depositStatistics.updateData({ loading: true });
      const {startDateStr, endDateStr, timeZone} = data;
      const result = await APIService.request("get", "/statistics/dnw", {
        startTime: dateStrWithTimezoneToUnix(startDateStr, timeZone),
        endTime: dateStrWithTimezoneToUnix(endDateStr, timeZone),
        period: "daily",
        timeZone: timeZone
      });
      let depositData = [];
      if (!result.error) {
        result.forEach(
          (item, index)=>{
            let current = {
              date: "",
              startTime: item.startTime,
              endTime: item.endTime,
              amount: item.depositTotal.dnwAmountInBTC,
              count: item.depositTotal.dnwCount,
            };
            let detail = [];
            for(const currency in item.depositVolume) {
              if (item.depositVolume.hasOwnProperty(currency)) {
                detail.push({
                  currency: currency,
                  amount: item.depositVolume[currency].dnwAmount,
                  amountInBTC: item.depositVolume[currency].dnwAmountInBTC,
                  count: item.depositVolume[currency].dnwCount,
                })
              }
              current.detail = detail;
            }
            depositData.push(current);
          }
        );
      }
      actions.depositStatistics.updateData({
        loading: false,
        depositData: depositData,
      });
    }
  }
};
