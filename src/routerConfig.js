export default {
  index: "/index",
  operation: {
    root: "/operation",
    kyc: "/operation/kyc",
    kycInspection: "/operation/kyc/inspection",
    withdraw: "/operation/withdraw",
    withdrawInspection: "/operation/withdraw/inspection",
    deposit: "/operation/deposit",
    depositInspection: "/operation/deposit/inspection"
  },
  user: {
    root: "/user",
    userList: "/user/list",
    userInspection: "/user/inspection"
  },
  config: {
    root: "/config",
    globalConfig: "/config/global",
    symbolConfig: "/config/symbol",
    currencyConfig: "/config/currency",
    rateLimit: "/config/rateLimit",
    apiResourceCost: "/config/apiResourceCost"
  },
  statistics: {
    root: "/statistics",
    tradingStatistics: "/statistics/trading"
  }
};
