import { actions } from "mirrorx";
import APIService from "Service/APIService";

export default {
  name: "rateLimit",
  initialState: {
    loading: false,
    list: []
  },
  reducers: {
    updateData(state, data) {
      return { ...state, ...data };
    }
  },
  effects: {
    async fetchRateLimit(data, getState) {
      actions.rateLimit.updateData({ loading: true });
      const result = await APIService.request(
        "get",
        "/admin/rate_limit_configs"
      );
      if (!result.error) {
        actions.rateLimit.updateData({ list: result });
      }
      actions.rateLimit.updateData({ loading: false });
    },
    async updateRateLimit(data, getState) {
      const result = await APIService.request(
        "post",
        "/admin/rate_limit_configs",
        data
      );
      if (!result.error) {
        actions.rateLimit.fetchRateLimit();
      }
    },
    async deleteRateLimit(data, getState) {
      const result = await APIService.request(
        "delete",
        "/admin/rate_limit_configs",
        data
      );
      if (!result.error) {
        actions.rateLimit.fetchRateLimit();
      }
    }
  }
};
