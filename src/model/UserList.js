import { actions } from "mirrorx";
import APIService from "Service/APIService";
import { ACCOUNT_FUNCTIONS } from "Utils/constant";

export default {
  name: "userList",
  initialState: {
    loading: false,
    list: [],
    userStatistics: []
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
        list = result.map(item => {
          return {
            userId: item.userId,
            email: item.email,
            phoneNumber: item.phoneNumber,
            accountStatus: item.accountStatus,
            kycStatus: item.kycStatus,
            registerDate: item.registerDate,
            accountFunctions: {
              [ACCOUNT_FUNCTIONS.USER]: item.accountStatus === "ACTIVATED",
              [ACCOUNT_FUNCTIONS.DEPOSIT]: !item.depositDisabled,
              [ACCOUNT_FUNCTIONS.WITHDRAW]: !item.withdrawDisabled,
              [ACCOUNT_FUNCTIONS.TRADE]: !item.tradeDisabled
            }
          };
        });
      }
      actions.userList.updateData({ list, loading: false });
    },
    async toggleAccountFunction(data, getState) {
      return await APIService.awsRequest(
        "put",
        "/admin/account_function",
        data
      );
    },
    async updateUserInList(data, getState) {
      let result = await actions.userList.toggleAccountFunction(data);
      if (result.error) {
        return;
      }
      let {
        userList: { list }
      } = getState();
      for (let i in list) {
        if (list[i].userId === data.userId) {
          list[i].accountFunctions[ACCOUNT_FUNCTIONS[data.func]] = !list[i]
            .accountFunctions[ACCOUNT_FUNCTIONS[data.func]];
          break;
        }
      }
      actions.userList.updateData({ list });
    },
    async getUserStatistics(data, getState) {
      actions.userList.updateData({ loading: true });
      const result = await APIService.awsRequest(
        "get",
        "/admin/user_statistics",
        data
      );
      let list = [];
      if (!result.error) {
        list = result;
      }
      actions.userList.updateData({ userStatistics: list, loading: false });
    }
  }
};
