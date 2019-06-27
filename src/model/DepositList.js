import { actions } from "mirrorx";

import APIService from "Service/APIService";

export default {
  name: "deposit",
  initialState: {
    loading: false,
    list: [],
    curRecord: {}
  },
  reducers: {
    updateData(state, data) {
      return { ...state, ...data };
    }
  },
  effects: {
    async fetchDeposit(data, getState) {
      actions.deposit.updateData({ loading: true });
      const fetchParam = data || {};
      fetchParam.type = "DEPOSIT";
      fetchParam.status = "DNW_SUCC";
      const result = await APIService.request(
        "get",
        "/admin/dnw_record",
        fetchParam
      );
      let list = [];
      if (!result.error) {
        list = result;
      }
      actions.deposit.updateData({ list, loading: false });
    },
    async getCurRecord(data, getState) {
      actions.deposit.updateData({ loading: true });
      const result = await APIService.request("get", "/admin/dnw_record", {
        type: "DEPOSIT",
        status: "DNW_SUCC",
        fromRecordId: data.curRecordId,
        toRecordId: data.curRecordId,
        userId: data.userId
      });
      if (!result.error) {
        actions.deposit.updateData({ curRecord: result[0], loading: false });
        return;
      }
      actions.deposit.updateData({ loading: false });
    }
  }
};
