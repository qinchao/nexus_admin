import mirror, { actions } from "mirrorx";
import OperationModel from "./model/Operation";
import KYCInspection from "./model/KYCInspection";
import WithdrawInspection from "./model/WithdrawInspection";

import { LOCATION_CHANGE } from "./utils/constant";
import qs from "qs";

// inject model
mirror.model(OperationModel);
mirror.model(KYCInspection);
mirror.model(WithdrawInspection);

// listen to route change
//Operation
mirror.hook((action, getState) => {
  const {
    routing: { location }
  } = getState();
  if (
    action.type === LOCATION_CHANGE &&
    location.pathname.indexOf("/operation/") === -1 &&
    location.pathname.indexOf("/operation") >= 0
  ) {
    const navTabCurQuery =
      location.search && qs.parse(location.search.substr(1));
    let navTab = navTabCurQuery.tab;
    actions.user.loginRequired().then(user => {
      if (!user) {
        return;
      }
      const {
        user: { cognitoGroup }
      } = getState();
      if (cognitoGroup.includes("WalletAdmin")) {
        navTab = navTab || "withdraw";
      } else if (cognitoGroup.includes("KycAdmin")) {
        navTab = navTab || "kyc";
      }
      actions.operation.changeNavTab(navTab);
      if (navTab === "withdraw") {
        actions.operation.initCurrencies();
        let fetchParam = { status: "WAITING_FOR_MANUAL_APPROVAL" };
        actions.operation.fetchWithdraw(fetchParam);
      } else if (navTab === "kyc") {
        let fetchParam = { status: "PENDING_FOR_REVIEW" };
        actions.operation.fetchKyc(fetchParam);
      }
    });
  }
});

//kycInpsection
mirror.hook((action, getState) => {
  const {
    routing: { location }
  } = getState();

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
});

//withdrawInspection
mirror.hook((action, getState) => {
  const {
    routing: { location }
  } = getState();

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
