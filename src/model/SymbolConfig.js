import { actions } from "mirrorx";
import APIService from "Service/APIService";
import { getIdToCurrency } from "Utils/index";

export default {
  name: "symbolConfig",
  initialState: {
    loading: false,
    innerSymbols: null, // map[symbolId] -> innerSymbol
    quoteBaseSymbols: null, // map[quoteCurrencyId][baseCurrencyId] -> innerSymbol
    submittable: false,
    idToCurrency: null
  },
  reducers: {
    updateData(state, data) {
      return { ...state, ...data };
    }
  },
  effects: {
    async submitSymbolConfig({ symbolConfig }) {
      await APIService.request("POST", "/config/inner_symbol", {
        symbolConfig: symbolConfig
      });
    },

    async fetchSymbolConfig() {
      actions.symbolConfig.updateData({ loading: true });
      let idToCurrency = await getIdToCurrency();
      const result = await APIService.request("get", "/config/inner_symbols");
      let quoteBaseSymbols = new Map();
      let innerSymbols = new Map();
      if (!result.error) {
        result.forEach(innerSymbol => {
          if (innerSymbol.hasOwnProperty("version")) {
            delete innerSymbol.version;
          }
          let baseCurrency = innerSymbol["baseCurrency"];
          let quoteCurrency = innerSymbol["quoteCurrency"];
          let symbol = innerSymbol["symbol"];
          innerSymbols.set(symbol, innerSymbol);
          if (quoteBaseSymbols.has(quoteCurrency)) {
            quoteBaseSymbols.get(quoteCurrency).set(baseCurrency, innerSymbol);
          } else {
            quoteBaseSymbols.set(
              quoteCurrency,
              new Map([[baseCurrency, innerSymbol]])
            );
          }
        });
      }
      actions.symbolConfig.updateData({
        innerSymbols,
        loading: false,
        quoteBaseSymbols,
        idToCurrency
      });
    }
  }
};
