import mirror, { actions } from "mirrorx";
import KYCListModel from "Model/KYCList";
import WithdrawListModel from "Model/WithdrawList";
import KYCInspection from "Model/KYCInspection";
import WithdrawInspection from "Model/WithdrawInspection";
import User from "Model/User";

import { LOCATION_CHANGE } from "./utils/constant";
import qs from "qs";

// inject model
mirror.model(User);
mirror.model(KYCListModel);
mirror.model(KYCInspection);
mirror.model(WithdrawListModel);
mirror.model(WithdrawInspection);

// listen to route change
mirror.hook((action, getState) => {
  const {
    routing: { location },
    user: { cognitoGroup }
  } = getState();

  // index
  if (
    action.type === LOCATION_CHANGE &&
    location.pathname.indexOf("/index") >= 0
  ) {
    actions.user.loginRequired().then(user => {
      if (!user) {
        return;
      }
    });
  }

  // withdrawList
  if (
    action.type === LOCATION_CHANGE &&
    location.pathname.indexOf("/withdrawList") >= 0
  ) {
    actions.user.loginRequired().then(user => {
      if (!user) {
        return;
      }

      if (cognitoGroup.includes("WalletAdmin")) {
        actions.withdraw.initCurrencies();
        actions.withdraw.fetchWithdraw({
          status: "WAITING_FOR_MANUAL_APPROVAL"
        });
      }
    });
  }

  // kycList
  if (
    action.type === LOCATION_CHANGE &&
    location.pathname.indexOf("/kycList") >= 0
  ) {
    actions.user.loginRequired().then(user => {
      if (!user) {
        return;
      }

      if (cognitoGroup.includes("KycAdmin")) {
        actions.kyc.fetchKyc({ status: "PENDING_FOR_REVIEW" });
      }
    });
  }

  // kycInpsection
  if (
    action.type === LOCATION_CHANGE &&
    location.pathname.indexOf("/kycInspection") >= 0
  ) {
    const params = qs.parse(location.search);
    let userId = params["?userId"];
    let createTime = params["createTime"];
    let inspect = params["inspect"] === "true";

    actions.user.loginRequired().then(user => {
      if (!user) {
        return;
      }
      actions.kycInspection.updateData({
        userId,
        inspect,
        createTime
      });
      actions.kycInspection.initKyc();
    });
  }

  // withdrawInspection
  if (
    action.type === LOCATION_CHANGE &&
    location.pathname.indexOf("/withdrawInspection") >= 0
  ) {
    const params = qs.parse(location.search);
    let userId = params["?userId"];
    let curRecordId = params["recordId"];
    let currency = params["currency"];
    let inspect = params["inspect"] === "true";

    actions.user.loginRequired().then(user => {
      if (!user) {
        return;
      }
      actions.withdrawInspection.updateData({
        curRecordId,
        userInfo: { authHistory: [], userId },
        inspect,
        currency: { value: currency, label: currency }
      });
      actions.withdrawInspection.initUserInfo(userId);
      actions.withdrawInspection.initWithdrawHistory(userId);
      actions.withdrawInspection.initWalletBalance();
    });
  }
});
