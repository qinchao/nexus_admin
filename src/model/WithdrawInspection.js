import { actions } from "mirrorx";
import APIService from "../service/APIService";

export default {
  name: "withdrawInspection",
  initialState: {
    curRecordId: "",
    userId: 0,
    auditResult: [],
    withdrawHistory: [],
    walletBalance: { options: [] },
    userBalance: { entries: [] },
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
      const {
        withdrawInspection: { userId }
      } = getState();
      await actions.userInspection.initUserInfo(userId);
      actions.withdrawInspection.updateData({ loading: false });
    },
    async initWithdrawHistory(data, getState) {
      actions.withdrawInspection.updateData({ loading: true });
      const {
        withdrawInspection: { userId }
      } = getState();
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
        actions.withdrawInspection.initAuditResult();
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
    },
    async initAuditResult(data, getState) {
      actions.withdrawInspection.updateData({ loading: true });
      const {
        withdrawInspection: { curRecordId, withdrawHistory }
      } = getState();
      for (let record of withdrawHistory) {
        if (record.recordId === parseInt(curRecordId)) {
          actions.withdrawInspection.updateData({
            loading: false,
            auditResult: record.auditResult ? [record.auditResult] : []
          });
          return;
        }
      }
    },
    async initUserBalance(data, getState) {
      const {
        withdrawInspection: { userId }
      } = getState();
      let userBalance = await APIService.request("get", "/admin/balance", {
        userId: userId,
        precalcAssetValue: true
      });
      if (!userBalance.error) {
        actions.withdrawInspection.updateData({ userBalance });
      }
      actions.withdrawInspection.updateData({ loading: false });
    }
  }
};
