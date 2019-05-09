import { actions } from "mirrorx";
import { notification } from "antd";

import APIService from "Service/APIService";
import CurrencyConfig from "Service/CurrencyConfig";

export default {
  name: "withdraw",
  initialState: {
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
    async fetchWithdraw(data, getState) {
      actions.withdraw.updateData({ loading: true });
      const fetchParam = data;
      fetchParam.type = "WITHDRAW";
      const result = await APIService.request(
        "get",
        "/admin/dnw_record",
        fetchParam
      );
      let list = [];
      if (!result.error) {
        list = result;
      }
      actions.withdraw.updateData({ list, loading: false });
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
    async initCurrencies(data, getState) {
      let currencies = await CurrencyConfig.getAllCurrencies();
      currencies = Array.from(currencies);
      currencies.unshift("All");
      actions.withdraw.updateData({ currencies });
    }
  }
};
