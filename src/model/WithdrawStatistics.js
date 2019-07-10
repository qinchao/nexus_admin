import { actions } from "mirrorx";
import APIService from "Service/APIService";
import {dateStrWithTimezoneToUnix} from "Utils/index.js"

export default {
  name: "withdrawStatistics",
  initialState: {
    loading: false,
    withdrawData: null,
  },
  reducers: {
    updateData(state, data) {
      return { ...state, ...data };
    }
  },
  effects: {
    async fetchDnwData(data, getState) {
      actions.withdrawStatistics.updateData({ loading: true });
      const {startDateStr, endDateStr, timeZone} = data;
      const result = await APIService.request("get", "/statistics/dnw", {
        startTime: dateStrWithTimezoneToUnix(startDateStr, timeZone),
        endTime: dateStrWithTimezoneToUnix(endDateStr, timeZone),
        period: "daily",
        timeZone: timeZone
      });
      let withdrawData = [];
      if (!result.error) {
        result.forEach(
          (item, index)=>{
            let current = {
              date: "",
              startTime: item.startTime,
              endTime: item.endTime,
              amount: item.withdrawTotal.dnwAmountInBTC,
              count: item.withdrawTotal.dnwCount,
            };
            let detail = [];
            for(const currency in item.withdrawVolume) {
              if (item.withdrawVolume.hasOwnProperty(currency)) {
                detail.push({
                  currency: currency,
                  amount: item.withdrawVolume[currency].dnwAmount,
                  amountInBTC: item.withdrawVolume[currency].dnwAmountInBTC,
                  count: item.withdrawVolume[currency].dnwCount,
                })
              }
              current.detail = detail;
            }
            withdrawData.push(current);
          }
        );
      }
      actions.withdrawStatistics.updateData({
        loading: false,
        withdrawData: withdrawData,
      });
    }
  }
};
