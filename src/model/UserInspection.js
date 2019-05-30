import { actions } from "mirrorx";
import APIService from "Service/APIService";

export default {
  name: "userInspection",
  initialState: {
    userInfo: { authHistory: [] },
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
    }
  }
};
