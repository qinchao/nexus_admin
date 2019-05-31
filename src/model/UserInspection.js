import { actions } from "mirrorx";
import APIService from "Service/APIService";

export default {
  name: "userInspection",
  initialState: {
    userInfo: { authHistory: [], userMFASettingList:[] },
    loading: false,
  },
  reducers: {
    updateData(state, data) {
      return { ...state, ...data };
    }
  },
  effects: {
    async initUserInfo(data, getState) {
      const userId = data;
      let userInfo = await APIService.awsRequest("get", "/admin/user", {
        userId
      });
      if (!userInfo.error) {
        //TODO add login-frequent location
        actions.userInspection.updateData({ userInfo });
      } 
    },
    async initUserInfoForUserInspection(data, getState) {
      actions.userInspection.updateData({loading: true});
      const userId = data;
      await actions.userInspection.initUserInfo(userId);
      actions.userInspection.updateData({ loading: false });
    },
    async initKycProfile(data, getState) {
      actions.userInspection.updateData({loading: true});
      const userId = data;
      let kycRecord = await APIService.awsRequest("get", "/admin/kyc_record", {
        userId
      });
      if (!kycRecord.error && kycRecord.length) {
        actions.kycInspection.updateData({ kycInfo: kycRecord[0] });
        actions.kycInspection.initImages();
      }else{
        actions.kycInspection.updateData({
          kycInfo:{}, 
          frontImage: "",
          backImage: "",
          humanImage: ""
        });
      }
      actions.userInspection.updateData({ loading: false });
    },
  }
};
