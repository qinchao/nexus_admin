import { actions } from "mirrorx";
import APIService from "Service/APIService";

export default {
  name: "apiResourceCost",
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
    async fetchApiResourceCosts(data, getState) {
      actions.rateLimit.updateData({ loading: true });
      const result = await APIService.request(
        "get",
        "/admin/api_resource_costs"
      );
      if (!result.error) {
        actions.apiResourceCost.updateData({ list: result });
      }
      actions.apiResourceCost.updateData({ loading: false });
    },
    async updateApiResourceCost(data, getState) {
      const result = await APIService.request(
        "put",
        "/admin/api_resource_costs",
        data
      );
      if (!result.error) {
        actions.apiResourceCost.fetchApiResourceCosts();
      }
    },
    async searchEntity(data, getState) {
      let {
        apiResourceCost: { list }
      } = getState();
      list = list.filter(item =>
        item.entity.toLowerCase().includes(data.toLowerCase())
      );
      actions.apiResourceCost.updateData({ list });
    }
  }
};
