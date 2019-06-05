import { actions } from "mirrorx";
import APIService from "Service/APIService";

export default {
  name: "globalConfig",
  initialState: {
    loading: false,
    allConfigs: null,
    inputTextStr: "",
    currentCategory: "",
    submittable: false,
  },
  reducers: {
    updateData(state, data) {
      return { ...state, ...data };
    }
  },
  effects: {
    async putNewGlobalConfig(data, getState) {
      const {category, config} = data;
      actions.globalConfig.updateData({ loading: true });
      await APIService.request(
        "put",
        "/config/global_config",
        {
          category: category,
          config: config,
        }
      );
      actions.globalConfig.updateData({ loading: false });
    },
    async fetchGlobalConfig(initCurrentCategory) {
      actions.globalConfig.updateData({ loading: true });
      const result = await APIService.request(
        "get",
        "/config/global_configs",
      );

      actions.globalConfig.updateData({
        allConfigs: result,
        loading: false,
      });

      if (initCurrentCategory){
        let defaultCategory = null;
        let defaultInput = "";
        if (result) {
          defaultCategory = Object.keys(result)[0];
          defaultInput = JSON.stringify(result[defaultCategory], null, 2);
        }
        actions.globalConfig.updateData({
          inputTextStr: defaultInput,
          currentCategory: defaultCategory,
        })
      }
    },

  }
};
