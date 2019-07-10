import { actions } from "mirrorx";
import APIService from "Service/APIService";
import moment from "moment-timezone";

export default {
  name: "overallStatistics",
  initialState: {
    loading: false,
    tradingData: [],
    tradingDataByCurrency: [],
    dnwData: [],
    profitData: [],
    periodInDay: 15,
  },
  reducers: {
    updateData(state, data) {
      return { ...state, ...data };
    }
  },
  effects: {
    async fetchData(data, getState) {
      actions.overallStatistics.updateData({ loading: true });
      const periodInDay = 15;
      const endTime = moment()
        .utc()
        .startOf("day")
        .add(1, "d");
      const startTime = moment()
        .utc()
        .startOf("day")
        .subtract(periodInDay - 1, "d");
      const dnwResult = await APIService.request("get", "/statistics/dnw", {
        startTime: startTime.unix(),
        endTime: endTime.unix(),
        period: "daily",
        timeZone: "UTC",
      });
      let dnwData = [];
      let profitData = [];
      if (!dnwResult.error) {
        dnwResult.forEach(
          (item, index)=>{
            let dateStr = moment.unix(item.startTime).format("MM/DD");
            dnwData.push({
              date: dateStr,
              dnwType: "deposit",
              amount: item.depositTotal.dnwAmountInBTC,
            });
            dnwData.push({
              date: dateStr,
              dnwType: "withdraw",
              amount: item.withdrawTotal.dnwAmountInBTC,
            });
            profitData.push({
              date: dateStr,
              amount: item.depositTotal.dnwAmountInBTC - item.withdrawTotal.dnwAmountInBTC,
            });
        })
      }
      const tradingResult = await APIService.request("get", "/statistics/trading", {
        startTime: startTime.unix(),
        endTime: endTime.unix(),
        period: "daily",
        timeZone: "UTC",
      });
      let tradingData = [];
      let tradingDataByCurrency = [];
      if (!tradingResult.error) {
        tradingResult.forEach(
          (item, index)=>{
            let dateStr = moment.unix(item.startTime).format("MM/DD");
            tradingData.push({
              date: dateStr,
              amount: item.totalInBTC.tradeAmount,
              count:  item.totalInBTC.tradeCount,
            });
            for (const currency in item.volumeByQuoteCurrency) {
              if (item.volumeByQuoteCurrency.hasOwnProperty(currency)) {
                tradingDataByCurrency.push({
                  date: dateStr,
                  currency: currency,
                  amount: item.volumeByQuoteCurrency[currency].tradeAmountInBTC,
                });
              }
            }
          })
      }
      actions.overallStatistics.updateData({
        loading: false,
        dnwData: dnwData,
        tradingData: tradingData,
        tradingDataByCurrency: tradingDataByCurrency,
        profitData: profitData,
        periodInDay: periodInDay,
      });
    }
  }
};
