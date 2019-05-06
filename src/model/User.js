import { actions } from "mirrorx";
import UserService from "Service/UserService";

async function doSetUser() {
  const user = await UserService.getCurrentUser();
  if (user) {
    let group = user.signInUserSession.accessToken.payload["cognito:groups"];
    actions.user.updateData({
      userName: user.username,
      userEmail: user.attributes.email,
      userInfo: user,
      cognitoGroup: group ? group : []
    });
  }
  return user;
}

export default {
  name: "user",
  initialState: {
    userInfo: {},
    userName: "",
    userEmail: "",
    cognitoGroup: []
  },
  reducers: {
    updateData(state, data) {
      return { ...state, ...data };
    }
  },
  effects: {
    async loginRequired(data, getState) {
      const user = await doSetUser();
      if (!user) {
        actions.routing.push("/login");
      }

      return user;
    },

    async isUserLogin(data, getState) {
      const user = await doSetUser();
      if (!user) {
        return false;
      }
      return user;
    },

    async setUser(data, getState) {
      const {
        user: { userName }
      } = getState();

      if (userName) return;

      await doSetUser();
    },

    clearUserData(data, getState) {
      actions.openorders.updateData({ openOrders: [], orderHistory: [] });
    },

    async signOut(data, getState) {
      await UserService.signOut();
      actions.user.updateData({
        userName: "",
        userEmail: "",
        userInfo: {},
        cognitoGroup: []
      });

      actions.routing.push("/login");
    }
  }
};
