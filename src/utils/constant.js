const LOCATION_CHANGE = "@@router/LOCATION_CHANGE";

const COLOR_CONFIG = {
  COMMON: {
    red: "#E45D3D",
    green: "#62C99B"
  },
  TEXT: {
    buy: "#62C99B",
    sell: "#E45D3D",
    BUY: "#62C99B",
    SELL: "#E45D3D"
  },
  BTN: {
    buy: "#62C99B",
    sell: "#E45D3D",
    execution: "rgb(33, 150, 243)"
  },
  LOADER: {
    primary: "rgba(170, 170, 170, 0.15)",
    secondary: "rgba(170, 170, 170, 0.1)"
  }
};

const ORDERBOOK_EXCHANGELOGO_NUM = 5;

const LIST_LENGTH_CONFIG = {
  ORDER_BOOK_CUT: 50,
  DEPTH_CHART: 50,
  TRADE_HISTORY: 50,
  MYORDERS: 10,
  TRANSACTION: 10
};

const TRADE_HISTORY_PREFECTCH_ROW_COUNT = 20;
const ORDER_HISTORY_PREFECTCH_ROW_COUNT = 20;
const DNW_HISTORY_SHORT = 5;

const PAIR_CONNECTION = "/";
const SYMBOL_CONNECTION = "_";

const LANG_LIST = ["en-US", "zh-CN", "zh-HK", "pt-BR", "ru", "vi", "tr", "es"];
const STABLE_CURRENCY = ["USDT", "PAX", "USDC"];
const QUOTE_CURRENCY = ["USDT", "PAX", "USDC", "BTC", "ETH"];

const ORDERBOOK_LAYOUT_ENUM = { COLUMN: "COLUMN", MIRROR: "MIRROR" };
const FIAT_COIN = {
  coin: "usd",
  unit: "$"
};

const MIDDLE_SCREEN_WIDTH = "1440px";
const SMALL_SCREEN_WIDTH = "990px";

const PWD_REGEX = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})");

const ZENDESK_LINK = "https://sophonexhelp.zendesk.com";


const PERMISSIONS = {
  WALLET_ADMIN: 'WALLET_ADMIN',
  KYC_ADMIN: 'KYC_ADMIN',
  SITE_ADMIN: 'SITE_ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN',
};

const ADMIN_GROUPS = {
  WALLET_ADMIN: 'WalletAdmin',
  KYC_ADMIN: 'KycAdmin',
  SITE_ADMIN: 'SiteAdmin',
  SUPER_ADMIN: 'SuperAdmin',
  OMNI: 'Omni',
};

export {
  LOCATION_CHANGE,
  COLOR_CONFIG,
  ORDERBOOK_EXCHANGELOGO_NUM,
  LIST_LENGTH_CONFIG,
  TRADE_HISTORY_PREFECTCH_ROW_COUNT,
  ORDER_HISTORY_PREFECTCH_ROW_COUNT,
  DNW_HISTORY_SHORT,
  PAIR_CONNECTION,
  SYMBOL_CONNECTION,
  LANG_LIST,
  STABLE_CURRENCY,
  QUOTE_CURRENCY,
  ORDERBOOK_LAYOUT_ENUM,
  FIAT_COIN,
  MIDDLE_SCREEN_WIDTH,
  SMALL_SCREEN_WIDTH,
  PWD_REGEX,
  ZENDESK_LINK,
  PERMISSIONS,
  ADMIN_GROUPS,
};
