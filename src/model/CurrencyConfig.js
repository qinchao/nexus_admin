import { actions } from "mirrorx";
import APIService from "Service/APIService";
import { getIdToCurrency } from "Utils/index";

export default {
  name: "currencyConfig",
  initialState: {
    loading: false,
    submittable: false,
    selectedCurrency: null,
    innerCurrencies: null,
    idToCurrency: null,
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
      let idToCurrency = await getIdToCurrency();
      const result = await APIService.request(
        "get",
        "/config/inner_currencies",
      );
      let innerCurrencies = new Map();
      if (!result.error) {
        result.forEach((innerCurrency) => {
          if (innerCurrency.hasOwnProperty("version")) {
            delete innerCurrency.version;
          }
          innerCurrencies.set(innerCurrency["currency"], innerCurrency);
        });
      }
      actions.currencyConfig.updateData({
        loading: false,
        innerCurrencies,
        idToCurrency,
      });
    },
  }
};
