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
    to: "/operation"
  },
  "operation.kycList": {
    key: "operation.kycList",
    name: "KYC",
    to: routerConfig.operation.kycList,
    permission: PERMISSIONS.KYC_ADMIN
  },
  "operation.withdrawList": {
    key: "operation.withdrawList",
    name: "Withdraw",
    to: routerConfig.operation.withdrawList,
    permission: PERMISSIONS.WALLET_ADMIN
  },

  user: {
    key: "user",
    name: "User",
    to: "/user",
  },
  "user.userList": {
    key: "userList",
    name: "User List",
    to: routerConfig.user.userList,
    permission: PERMISSIONS.USER_ADMIN,
  },
  "user.assets": {
    key: "userAssets",
    name: "User Assets",
    to: routerConfig.user.userAssets,
    permission: PERMISSIONS.USER_ADMIN,
  },
  "user.security": {
    key: "userSecurity",
    name: "User Security",
    to: routerConfig.user.userSecurity,
    permission: PERMISSIONS.USER_ADMIN,
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
