import { actions } from "mirrorx";
import APIService from "../service/APIService";

export default {
  name: "withdrawInspection",
  initialState: {
    userInfo: { authHistory: [] },
    curRecordId: "",
    withdrawHistory: [],
    walletBalance: {},
    loading: true
  },
  reducers: {
    updateData(state, data) {
      return { ...state, ...data };
    }
  },
  effects: {
    async initUserInfo(data, getState) {
      actions.withdrawInspection.updateData({ loading: true });
      const userId = data;
      let userInfo = await APIService.awsRequest("get", "/admin/user", {
        userId
      });
      if (!userInfo.error) {
        //TODO add login-frequent location
        actions.withdrawInspection.updateData({ userInfo, loading: false });
      } else {
        actions.withdrawInspection.updateData({ loading: false });
      }
    },
    async initWithdrawHistory(data, getState) {
      actions.withdrawInspection.updateData({ loading: true });
      const userId = data;
      const withdrawHistory = await APIService.request(
        "get",
        "/admin/dnw_record",
        { userId, type: "WITHDRAW" }
      );
      if (!withdrawHistory.error) {
        actions.withdrawInspection.updateData({
          withdrawHistory,
          loading: false
        });
      } else {
        actions.withdrawInspection.updateData({
          withdrawHistory: [],
          loading: false
        });
      }
    },
    async initWalletBalance(data, getState) {
      actions.withdrawInspection.updateData({ loading: true });
      let walletBalance = await APIService.request("get", "/wallet/balance");
      // temporarily save for testing
      // walletBalance = {entries: [{
      //   "currency": "BTC",
      //   "balance": "1.53400000",
      //   "available": "1.02300000"
      // },{
      //   "currency": "USDT",
      //   "balance": "1.83400000",
      //   "available": "1.88300000"
      // },
      // ]};
      if (walletBalance.entries && walletBalance.entries.length) {
        let balance = {};
        let options = walletBalance.entries.map(item => {
          balance[item.currency] = {
            balance: item.balance,
            available: item.available
          };
          return item.currency;
        });
        actions.withdrawInspection.updateData({
          walletBalance: { balance, options }
        });
      }
      actions.withdrawInspection.updateData({ loading: false });
    }
  }
};
