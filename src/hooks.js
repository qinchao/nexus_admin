import mirror, { actions } from "mirrorx";
import moment from "moment";
import UserListModel from "Model/UserList";
import KYCListModel from "Model/KYCList";
import WithdrawListModel from "Model/WithdrawList";
import KYCInspection from "Model/KYCInspection";
import WithdrawInspection from "Model/WithdrawInspection";
import UserInspection from "Model/UserInspection";
import User from "Model/User";

import {PERMISSIONS} from "./utils/constant"
import { LOCATION_CHANGE } from "./utils/constant";
import qs from "qs";

// inject model
mirror.model(User);
mirror.model(UserListModel);
mirror.model(UserInspection);
mirror.model(KYCListModel);
mirror.model(KYCInspection);
mirror.model(WithdrawListModel);
mirror.model(WithdrawInspection);

const hookConfigs = [
  {
    path: "/operation/withdraw",
    permission: PERMISSIONS.WALLET_ADMIN,
    handler: (getState) => {
      actions.withdraw.initCurrencies();
      actions.withdraw.fetchWithdraw({
        status: "WAITING_FOR_MANUAL_APPROVAL",
      });
    },
  },
  {
    path: "/operation/withdraw/inspection",
    permission: PERMISSIONS.WALLET_ADMIN,
    handler: async (getState) => {
      const {
        routing: { location: { search } }
      } = getState();
      const params = search && qs.parse(search.substr(1));
      let userId = params["userId"];
      let curRecordId = params["recordId"];
      let currency = params["currency"];
      let inspect = params["inspect"] === "true";

      await actions.withdrawInspection.updateData({
        curRecordId,
        userId,
        inspect,
        currency
      });
      actions.withdrawInspection.initUserInfo();
      actions.withdrawInspection.initWithdrawHistory(currency);
      actions.withdrawInspection.initWalletBalance();
    },
  },
  {
    path: "/operation/kyc",
    permission: PERMISSIONS.KYC_ADMIN,
    handler: (getState) => {
      actions.kyc.fetchKyc({ status: "PENDING_FOR_REVIEW" });
    },
  },
  {
    path: "/operation/kyc/inspection",
    permission: PERMISSIONS.KYC_ADMIN,
    handler: (getState) => {
      const {
        routing: { location: { search } }
      } = getState();
      const params = search && qs.parse(search.substr(1));
      let userId = params["userId"];
      let createTime = params["createTime"];
      let inspect = params["inspect"] === "true";
      actions.kycInspection.updateData({
        inspect,
        createTime
      });
      actions.kycInspection.initKyc(userId);
    },
  },
  {
    path: "/user/list",
    permission: PERMISSIONS.KYC_ADMIN,
    handler: (getState) => {
      actions.userList.fetchUsers();
    },
  },
  {
    path: "/user/inspection",
    permission: PERMISSIONS.KYC_ADMIN,
    handler: async (getState) => {
      const {
        routing: { location: { search } }
      } = getState();
      const params = search && qs.parse(search.substr(1));
      let userId = params["userId"];
      actions.userInspection.initUserInfoForUserInspection(userId);
      actions.userInspection.initKycProfile(userId);
    },
  },
];

// listen to route change
mirror.hook((action, getState) => {
  const {
    routing: { location }
  } = getState();

  if (action.type !== LOCATION_CHANGE) {
    return;
  }
  actions.user.loginRequired().then(user => {
    if (!user) {
      return;
    }
    const { user: userState } = getState();

    for (let hookConfig of hookConfigs) {
      if (location.pathname.indexOf(hookConfig.path) >= 0) {
        if (hookConfig.permission && !userState.permissions[hookConfig.permission]) {
          actions.routing.push("/index");
          return;
        }
        hookConfig.handler(getState);
      }
    }
  });
});
