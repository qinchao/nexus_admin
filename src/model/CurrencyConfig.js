import { actions } from "mirrorx";
import APIService from "Service/APIService";

export default {
  name: "currencyConfig",
  initialState: {
    loading: false,
    submittable: false,
    selectedCurrency: null,
    innerCurrencies: null,
  },
  reducers: {
    updateData(state, data) {
      return { ...state, ...data };
    }
  },
  effects: {
    async submitCurrencyConfig({currencyConfig}) {
      await APIService.request(
        "POST",
        "/config/inner_currency",
        {
          currencyConfig: currencyConfig,
        }
      );
    },

    async fetchCurrencyConfig(data, getState) {
      actions.currencyConfig.updateData({ loading: true });
      const result = await APIService.request(
        "get",
        "/config/inner_currencies",
      );
      let innerCurrencies = new Map();
      if (result) {
        result.map((innerCurrency) => {
          if (innerCurrency.hasOwnProperty("version")) {
            delete innerCurrency.version;
          }
          innerCurrencies.set(innerCurrency["currency"], innerCurrency);
        });
      }
      actions.currencyConfig.updateData({ loading: false, innerCurrencies:innerCurrencies });
    },
  }
};
