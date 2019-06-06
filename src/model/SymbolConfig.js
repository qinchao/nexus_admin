import { actions } from "mirrorx";
import APIService from "Service/APIService";

export default {
  name: "symbolConfig",
  initialState: {
    loading: false,
    innerSymbols: null, // map[symbolId] -> innerSymbol
    quoteBaseSymbol: null, // map[quoteCurrencyId][baseCurrencyId] -> innerSymbol
    submittable: false,
  },
  reducers: {
    updateData(state, data) {
      return { ...state, ...data };
    }
  },
  effects: {
    async submitSymbolConfig({symbolConfig}) {
      await APIService.request(
        "POST",
        "/config/inner_symbol",
        {
          "symbolConfig": symbolConfig,
        }
      );
    },

    async fetchSymbolConfig() {
      actions.symbolConfig.updateData({ loading: true });
      const result = await APIService.request(
        "get",
        "/config/inner_symbols",
      );

      let quoteBaseSymbol = new Map();
      let innerSymbols = new Map();
      if (result) {
        result.map(innerSymbol => {
          if (innerSymbol.hasOwnProperty("version")) {
            delete innerSymbol.version;
          }
          let baseCurrency = innerSymbol["baseCurrency"];
          let quoteCurrency = innerSymbol["quoteCurrency"];
          let symbol = innerSymbol["symbol"];
          innerSymbols.set(symbol, innerSymbol);
          if (quoteBaseSymbol.has(quoteCurrency)) {
            quoteBaseSymbol.get(quoteCurrency).set(baseCurrency, innerSymbol);
          } else {
            quoteBaseSymbol.set(quoteCurrency, new Map([[baseCurrency, innerSymbol]]));
          }
        });
      }
      actions.symbolConfig.updateData({
        innerSymbols,
        loading: false,
        quoteBaseSymbol,
      });
    },
  }
};
