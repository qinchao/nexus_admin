import APIService from "./APIService";
import { getBaseFromSymbol } from "Utils/index";
import { SYMBOL_CONNECTION } from "Utils/constant";

class CurrencyConfig {
  constructor() {
    this.currencies = new Map();
  }

  async getAllCurrencies() {
    if (this.currencies.size === 0) {
      await this.init();
    }
    return this.currencies.keys();
  }

  async getAllCurrencyInfos() {
    if (this.currencies.size === 0) {
      await this.init();
    }
    return this.currencies;
  }

  /**
   * getCurrencyInfo
   * @param {string} currency
   * @return {object} {} || {currencyInfo}
   */
  async getCurrencyInfo(currency) {
    if (!currency) {
      return {};
    }
    if (this.currencies.size === 0) {
      await this.init();
    }

    return this.getCurrencyInfoSync(currency);
  }

  getCurrencyInfoSync(currency) {
    if (this.currencies.has(currency)) {
      return this.currencies.get(currency);
    } else {
      return {};
    }
  }

  async init() {
    // const data = await WsService.getCurrencies();
    const result = await APIService.requestWithoutLogin(
      "get",
      "/config/currencies"
    );

    if (result.error) {
      console.error(`Failed to get currencies, ${result.error.message}`);
      return;
    }
    for (let currency of result) {
      currency["logo"] = this.getIconUrl(currency.currency);
      this.currencies.set(currency.currency, currency);
    }
  }

  /**
   * Return S3 URL of the icon/token
   * @param {string} currencyOrSymbol
   * @returns {string}
   */
  getIconUrl(currencyOrSymbol) {
    let currency = currencyOrSymbol;
    if (currencyOrSymbol.indexOf(SYMBOL_CONNECTION) !== -1)
      currency = getBaseFromSymbol(currencyOrSymbol);
    return `https://s3-us-west-1.amazonaws.com/sophon-public/symbolicons/${currency.toLowerCase()}.png`;
  }
}

const config = new CurrencyConfig();

export default config;
