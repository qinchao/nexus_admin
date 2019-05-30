import { actions } from "mirrorx";
import APIService from "Service/APIService";

export default {
  name: "globalConfig",
  initialState: {
    loading: false,
    allConfigs: null,
    inputTextStr: "",
  },
  reducers: {
    updateData(state, data) {
      return { ...state, ...data };
    }
  },
  effects: {
    async fetchGlobalConfig(data, getState) {
      actions.globalConfig.updateData({ loading: true });
      const result = await APIService.request(
        "get",
        "/config/global_configs",
      );
      console.log("fetchGlobalConfig result:", result);
      actions.globalConfig.updateData({ allConfigs: result, loading: false});
    },
  }
};
