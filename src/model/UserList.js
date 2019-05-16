import { actions } from "mirrorx";
import APIService from "Service/APIService";

export default {
  name: "userList",
  initialState: {
    loading: false,
    list: []
  },
  reducers: {
    updateData(state, data) {
      return { ...state, ...data };
    }
  },
  effects: {
    async fetchUsers(data, getState) {
      actions.userList.updateData({ loading: true });
      const fetchParam = data;
      const result = await APIService.awsRequest(
        "get",
        "/admin/users",
        fetchParam
      );
      let list = [];
      if (!result.error) {
        list = result;
      }
      actions.userList.updateData({ list, loading: false });
    },
  }
};
