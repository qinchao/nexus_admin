import {ADMIN_GROUPS, PERMISSIONS} from "./constant";

export function getPermissionsFromGroups(groups) {
  let result = {};
  for (let group of groups) {
    switch (group) {
      case ADMIN_GROUPS.WALLET_ADMIN:
        result[PERMISSIONS.WALLET_ADMIN] = true;
        break;
      case ADMIN_GROUPS.KYC_ADMIN:
        result[PERMISSIONS.KYC_ADMIN] = true;
        break;
      case ADMIN_GROUPS.SITE_ADMIN:
        result[PERMISSIONS.SITE_ADMIN] = true;
        break;
      case ADMIN_GROUPS.SUPER_ADMIN:
        result[PERMISSIONS.SITE_ADMIN] = true;
        result[PERMISSIONS.KYC_ADMIN] = true;
        result[PERMISSIONS.WALLET_ADMIN] = true;
        result[PERMISSIONS.SUPER_ADMIN] = true;
        break;
      case ADMIN_GROUPS.OMNI:
        result[PERMISSIONS.SITE_ADMIN] = true;
        result[PERMISSIONS.KYC_ADMIN] = true;
        result[PERMISSIONS.WALLET_ADMIN] = true;
        result[PERMISSIONS.SUPER_ADMIN] = true;
        break;
      default:
        console.log(`Invalid Group Name: ${group}`);
    }
  }
  return result;
};