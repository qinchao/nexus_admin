import { PERMISSIONS } from "./constant";
import routerConfig from "appSrc/routerConfig";

/**
 * The naming of menu item should be "firstLevelItemName.secondLevelName.thirdLevelName"
 * E.g. "reporting", "reporting.operationalReports", "reporting.operationalReports.depositReports".
 * Those are level-1, level-2 and level-3 menu items.
 * @type {{"operation.withdrawList": {name: string, permission: string, to: string, key: string}, "operation.kycList": {name: string, permission: string, to: (string), key: string}, operation: {name: string, to: string, key: string}, user: {name: string, to: string, key: string}}}
 */
const adminMenuItemData = {
  operation: {
    key: "operation",
    name: "Operation",
    to: routerConfig.operation.root
  },
  "operation.kyc": {
    key: "operation.kyc",
    name: "KYC",
    to: routerConfig.operation.kyc,
    permission: PERMISSIONS.KYC_ADMIN
  },
  "operation.withdraw": {
    key: "operation.withdraw",
    name: "Withdraw",
    to: routerConfig.operation.withdraw,
    permission: PERMISSIONS.WALLET_ADMIN
  },
  "operation.deposit": {
    key: "operation.deposit",
    name: "Deposit",
    to: routerConfig.operation.deposit,
    permission: PERMISSIONS.WALLET_ADMIN
  },

  user: {
    key: "user",
    name: "User",
    to: routerConfig.user.root
  },
  "user.userList": {
    key: "userList",
    name: "User List",
    to: routerConfig.user.userList,
    permission: PERMISSIONS.USER_ADMIN
  },

  config: {
    key: "config",
    name: "Config",
    to: routerConfig.config.root,
    permission: PERMISSIONS.SITE_ADMIN
  },
  "config.global": {
    key: "globalConfig",
    name: "Global Config",
    to: routerConfig.config.globalConfig,
    permission: PERMISSIONS.SITE_ADMIN
  },
  "config.currency": {
    key: "currencyConfig",
    name: "Currency Config",
    to: routerConfig.config.currencyConfig,
    permission: PERMISSIONS.SITE_ADMIN
  },
  "config.symbol": {
    key: "symbolConfig",
    name: "Symbol Config",
    to: routerConfig.config.symbolConfig,
    permission: PERMISSIONS.SITE_ADMIN
  },
  "config.rateLimit": {
    key: "rateLimit",
    name: "Rate Limit",
    to: routerConfig.config.rateLimit,
    permission: PERMISSIONS.SITE_ADMIN
  },
  "config.apiResourceCost": {
    key: "apiResourceCost",
    name: "API Resource Cost",
    to: routerConfig.config.apiResourceCost,
    permission: PERMISSIONS.SITE_ADMIN
  },

  statistics: {
    key: "statistics",
    name: "Statistics",
    to: routerConfig.statistics.root,
    permission: PERMISSIONS.SITE_ADMIN
  },
  "statistics.overall": {
    key: "overallStatistics",
    name: "Overall Statistics",
    to: routerConfig.statistics.overall,
    permission: PERMISSIONS.SITE_ADMIN
  },
  "statistics.trading": {
    key: "tradingStatistics",
    name: "Trading Statistics",
    to: routerConfig.statistics.tradingStatistics,
    permission: PERMISSIONS.SITE_ADMIN
  },
  "statistics.user": {
    key: "user",
    name: "User Statistics",
    to: routerConfig.statistics.userStatistics,
    permission: PERMISSIONS.SITE_ADMIN
  },
  "statistics.deposit": {
    key: "depositStatistics",
    name: "Deposit Statistics",
    to: routerConfig.statistics.depositStatistics,
    permission: PERMISSIONS.SITE_ADMIN
  },
  "statistics.withdraw": {
    key: "withdrawStatistics",
    name: "Withdraw Statistics",
    to: routerConfig.statistics.withdrawStatistics,
    permission: PERMISSIONS.SITE_ADMIN
  },
};

/**
 * Check if user can see the given menu item. The menu item might not be the leaf item.
 * If user can see any sub menu item in the tree, we should let them see this item.
 * @param user
 * @param itemKey
 * @return {boolean}
 */
function canSeeMenuItem(user, menuItemData) {
  if (menuItemData.permission) {
    // This is a leaf menu item, check its permission requirement directly.
    return user.permissions[menuItemData.permission];
  }
  for (let itemKey of Object.keys(adminMenuItemData)) {
    if (itemKey.startsWith(menuItemData.key + ".")) {
      const itemData = adminMenuItemData[itemKey];
      if (itemData.permission && user.permissions[itemData.permission]) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Return all the menu item data that user can see according to the itemKeys input.
 * @param user
 * @param itemKeys
 * @returns {Array}
 */
export function getMenuItemData(user, itemKeys) {
  let itemData = [];
  for (let itemKey of itemKeys) {
    const menuItemData = adminMenuItemData[itemKey];
    if (!canSeeMenuItem(user, menuItemData)) {
      continue;
    }
    itemData.push(menuItemData);
  }

  return itemData;
}
