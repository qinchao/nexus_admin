import mirror, { actions } from "mirrorx";
import KYCListModel from "Model/KYCList";
import WithdrawListModel from "Model/WithdrawList";
import KYCInspection from "Model/KYCInspection";
import WithdrawInspection from "Model/WithdrawInspection";
import User from "Model/User";

import {PERMISSIONS} from "./utils/constant"
import { LOCATION_CHANGE } from "./utils/constant";
import qs from "qs";

// inject model
mirror.model(User);
mirror.model(KYCListModel);
mirror.model(KYCInspection);
mirror.model(WithdrawListModel);
mirror.model(WithdrawInspection);

const hookConfigs = [
  {
    path: "/operation/withdraw/list",
    permission: PERMISSIONS.WALLET_ADMIN,
    handler: (getState) => {
      actions.withdraw.initCurrencies();
      actions.withdraw.fetchWithdraw({
        status: "WAITING_FOR_MANUAL_APPROVAL"
      });
    },
  },
  {
    path: "/operation/withdraw/inspection",
    permission: PERMISSIONS.WALLET_ADMIN,
    handler: (getState) => {
      const {
        routing: { location }
      } = getState();
      const params = qs.parse(location.search);
      let userId = params["?userId"];
      let curRecordId = params["recordId"];
      let currency = params["currency"];
      let inspect = params["inspect"] === "true";

      actions.withdrawInspection.updateData({
        curRecordId,
        userInfo: { authHistory: [], userId },
        inspect,
        currency
      });
      actions.withdrawInspection.initUserInfo(userId);
      actions.withdrawInspection.initWithdrawHistory(userId);
      actions.withdrawInspection.initWalletBalance();
    },
  },
  {
    path: "/operation/kyc/list",
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
        routing: { location }
      } = getState();
      const params = qs.parse(location.search);
      let userId = params["?userId"];
      let createTime = params["createTime"];
      let inspect = params["inspect"] === "true";
      actions.kycInspection.updateData({
        userId,
        inspect,
        createTime
      });
      actions.kycInspection.initKyc();
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
