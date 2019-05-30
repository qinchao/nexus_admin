import { actions } from "mirrorx";
import APIService from "../service/APIService";

export default {
  name: "withdrawInspection",
  initialState: {
    curRecordId: "",
    userId: 0,
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
      actions.withdrawInspection.updateData({loading: true});
      const {withdrawInspection: {userId}} = getState();
      await actions.userInspection.initUserInfo(userId);
      actions.withdrawInspection.updateData({ loading: false });
    },
    async initWithdrawHistory(data, getState) {
      actions.withdrawInspection.updateData({ loading: true });
      const {withdrawInspection:{userId}} = getState();
      const currency = data;
      const withdrawHistory = await APIService.request(
        "get",
        "/admin/dnw_record",
        { userId, currency, type: "WITHDRAW" }
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
