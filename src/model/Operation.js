import { actions } from "mirrorx";
import { notification } from "antd";

import APIService from "Service/APIService";
import CurrencyConfig from "Service/CurrencyConfig";

export default {
  name: "operation",
  initialState: {
    navTabCur: "",
    loading: false,
    list: [],
    currencies: []
  },
  reducers: {
    updateData(state, data) {
      return { ...state, ...data };
    }
  },
  effects: {
    async changeNavTab(data, getState) {
      const navTabCur = data;
      actions.operation.updateData({ navTabCur });
    },
    async fetchWithdraw(data, getState) {
      actions.operation.updateData({ loading: true });
      const fetchParam = data;
      fetchParam.type = "WITHDRAW";
      const list = await APIService.request(
        "get",
        "/admin/dnw_record",
        fetchParam
      );
      if (!list.error) {
        actions.operation.updateData({ list });
      } else {
        actions.operation.updateData({ list: [] });
      }
      actions.operation.updateData({ loading: false });
    },
    async withdrawUpdate(data, getState) {
      const { dnwRecordId, action, message } = data;
      const withdrawUpdateRes = await APIService.request(
        "put",
        `/account/withdraw/${dnwRecordId}`,
        {
          action,
          message
        }
      );
      if (!withdrawUpdateRes.error) {
        notification.success({
          message: "Success",
          description: `DnwRecordId ${dnwRecordId} has been ${action}ED.`
        });
      }
    },
    async fetchKyc(data, getState) {
      actions.operation.updateData({ loading: true });
      const fetchParam = data;
      const list = await APIService.awsRequest(
        "get",
        "/admin/kyc_record",
        fetchParam
      );
      if (!list.error) {
        actions.operation.updateData({ list });
      } else {
        actions.operation.updateData({ list: [] });
      }
      actions.operation.updateData({ loading: false });
    },
    async kycStatusUpdate(data, getState) {
      const { userId, createTime, status, message } = data;
      const kycStatusUpdateRes = await APIService.awsRequest(
        "put",
        "/admin/kyc_status",
        { userId, createTime, status, message }
      );
      if (!kycStatusUpdateRes.error) {
        notification.success({
          message: "Success",
          description: `kyc request with userId: ${userId} and createTime: ${createTime} has been ${status}`
        });
      }
    },
    async initCurrencies(data, getState) {
      let currencies = await CurrencyConfig.getAllCurrencyInfos();
      currencies = Array.from(currencies).map(item => {
        return { value: item.currency, label: item.currency };
      });
      currencies.unshift({ value: "All", label: "All" });
      actions.operation.updateData({ currencies });
    }
  }
};
