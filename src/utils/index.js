import Big from "big.js";
import format from "date-fns/format";
import { PAIR_CONNECTION, SYMBOL_CONNECTION, LANG_LIST } from "./constant.js";

Big.RM = 0; // ROUND_DOWN, aka floor

export function getTimeColor(start) {
  return start < new Date(new Date().setHours(new Date().getHours() - 12));
}

export function toThousandsString(number) {
  const splitNumber = number.toString().split(".");
  let integer = splitNumber[0];
  const decimal = splitNumber[1] || "";

  let result = "";
  while (integer.length > 3) {
    result = "," + integer.slice(-3) + result;
    integer = integer.slice(0, integer.length - 3);
  }
  if (integer) {
    result = integer + result;
  }

  if (decimal === "") {
    return result;
  }

  return result + "." + decimal;
}

export function formatToFixedNumber(value, precision = 7) {
  value = Big(value);
  return value.gt(1)
    ? value.toPrecision(precision)
    : value.toFixed(precision - 1);
}

/**
 * Convert Pair string to Symbol string
 * @param  {string} productPair BTC/USDT
 * @return {string} symbolPair  BTC_USDT
 */
export function getSymbolFromPair(productPair) {
  return productPair && productPair.replace(PAIR_CONNECTION, SYMBOL_CONNECTION);
}
/**
 * Extract Base currency from Symbol string
 * @param  {string} symbol BTC_ETH
 * @return {string} base currency BTC
 */
export function getBaseFromSymbol(symbol) {
  if (symbol.indexOf(SYMBOL_CONNECTION) === -1) {
    return null;
  }
  return symbol.split(SYMBOL_CONNECTION)[0];
}

/**
 * Extract Quote currency from Symbol string
 * @param  {string} symbol BTC_ETH
 * @return {string} quote currency ETH
 */
export function getQuoteFromSymbol(symbol) {
  if (symbol.indexOf(SYMBOL_CONNECTION) === -1) {
    return null;
  }
  return symbol.split(SYMBOL_CONNECTION)[1];
}

/**
 * Convert currencies to Symbol string
 * @param  {string} base       BTC
 * @param  {string} quote      USDT
 * @return {string} symbolPair BTC_USDT
 */
export function getSymbolWithCurrencies(base, quote) {
  return base + SYMBOL_CONNECTION + quote;
}

/**
 * Convert Symbol string to Pair string
 * @param  {string} symbolPair  BTC_USDT
 * @return {string} productPair BTC/USDT
 */
export function getPairFromSymbol(productPair) {
  return productPair && productPair.replace(SYMBOL_CONNECTION, PAIR_CONNECTION);
}

/**
 * Convert currencies to Pair string
 * @param  {string} base        BTC
 * @param  {string} quote       USDT
 * @return {string} productPair BTC/USDT
 */
export function getPairWithCurrencies(base, quote) {
  return base + PAIR_CONNECTION + quote;
}

/**
 * get exchange path with Pair string / Symbol string
 * @param  {string} pair         BTC_USDT / BTC/USDT
 * @return {string} exchangePath /exchange/BTC_USDT
 */
export function getExchangePath(
  pair = localStorage.getItem("productPair") ||
    "BTC" + SYMBOL_CONNECTION + "USDT"
) {
  return "/exchange/" + getSymbolFromPair(pair);
}

/**
 * Get the current language
 * @returns {string} default value is en-US
 */
export function getLang() {
  const browserLang = navigator.language || navigator.userLanguage;
  let langDefault = localStorage.getItem("lang") || browserLang || "en-US";

  for (const lang of LANG_LIST) {
    if (lang.indexOf(langDefault) !== -1) {
      return lang;
    }
  }
  return "en-US";
}

/**
 * Set the current language
 * @param lang "en-US | zh-CN | zh-TW | pt-BR"
 */
export function setLang(lang) {
  if (typeof lang !== "string") {
    lang = "en-US";
  }
  localStorage.setItem("lang", lang);
}

/**
 * formatTime
 * @param  {string} timestamp
 * @return {string} HH:mm:ss
 */
export function formatTime(timestamp) {
  return format(new Date(+timestamp), "HH:mm:ss");
}

/**
 * formatDate
 * @param  {string} timestamp
 * @return {string} yyyy-MM-dd HH:mm:ss
 */
export function formatDate(timestamp) {
  if (!timestamp) {
    return "";
  }
  return format(new Date(+timestamp), "yyyy-MM-dd HH:mm:ss");
}

export function formatDateShort(timestamp) {
  if (!timestamp) {
    return "";
  }
  return format(new Date(+timestamp), "MM-dd HH:mm:ss");
}

/**
 * formatDateOnly
 * @param  {string} timestamp
 * @return {string} yyyy-MM-dd
 */
export function formatDateOnly(timestamp) {
  return format(new Date(+timestamp), "yyy-MM-dd");
}

/**
 * Extract USD price from tickers for currency
 * @param currency
 * @param tickers
 * @returns {string} $0.21
 */
export function calcValueUSDT(currency, tickers) {
  if (!tickers) {
    return "";
  }

  if (currency === "USDT") {
    return "";
  }

  let valueUSDT = "";

  if (currency === "BTC") {
    const btcPriceTicker = tickers.get("BTC" + SYMBOL_CONNECTION + "USDT");
    if (!btcPriceTicker) return "";
    valueUSDT = btcPriceTicker.closePrice;
  } else {
    let valueBTC = 0;
    const quoteUSDT = currency + SYMBOL_CONNECTION + "USDT";
    const quoteBTC = currency + SYMBOL_CONNECTION + "BTC";
    const baseBTC = "BTC" + SYMBOL_CONNECTION + currency;

    if (tickers.has(quoteUSDT)) {
      valueUSDT = tickers.get(quoteUSDT).closePrice;
    } else if (tickers.has(quoteBTC)) {
      valueBTC = tickers.get(quoteBTC).closePrice;
      valueUSDT = Big(valueBTC)
        .times(tickers.get("BTC" + SYMBOL_CONNECTION + "USDT").closePrice)
        .toFixed(2);
    } else if (tickers.has(baseBTC) && +tickers.get(baseBTC).closePrice !== 0) {
      valueBTC = Big(1).div(tickers.get(baseBTC).closePrice);
      valueUSDT = Big(valueBTC)
        .times(tickers.get("BTC" + SYMBOL_CONNECTION + "USDT").closePrice)
        .toFixed(2);
    }
  }

  return valueUSDT;
}

export function isSubsequence(sub, str) {
  sub = sub.toUpperCase();
  str = str.toUpperCase();
  let j = 0;
  for (let i = 0; i < sub.length; i++) {
    j = str.indexOf(sub[i], j);
    if (j === -1) {
      return false;
    }
    j++;
  }
  return true;
}

export function prefixMatch(sub, str) {
  sub = sub.toUpperCase();
  str = str.toUpperCase();

  return str.indexOf(sub) === 0;
}

// https://stackoverflow.com/a/5624139
export function hexToRgb(hex) {
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function(m, r, g, b) {
    return r + r + g + g + b + b;
  });

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      }
    : null;
}

export function getEnv() {
  return process.env.NODE_ENV;
}

export function getTimezone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export function getClientType() {
  if (
    navigator.userAgent.match(/Android/i) ||
    navigator.userAgent.match(/webOS/i) ||
    navigator.userAgent.match(/iPhone/i) ||
    navigator.userAgent.match(/iPad/i) ||
    navigator.userAgent.match(/iPod/i) ||
    navigator.userAgent.match(/BlackBerry/i) ||
    navigator.userAgent.match(/Windows Phone/i)
  ) {
    return "h5";
  } else {
    return "web";
  }
}

export function camelize(text) {
  text = text.toLowerCase();

  return text[0].toUpperCase() + text.slice(1);
}

export function currencyPairIsValid(pair) {
  if (pair.indexOf(SYMBOL_CONNECTION) < 0) {
    return false;
  }
  const pairArr = pair.split(SYMBOL_CONNECTION);
  if (pairArr.length !== 2) {
    return false;
  }
  if (!pairArr[0].length || !pairArr[1].length) {
    return false;
  }
  return true;
}

