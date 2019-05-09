import { actions } from "mirrorx";
import { notification } from "antd";

import APIService from "Service/APIService";

export default {
  name: "kyc",
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
    async fetchKyc(data, getState) {
      actions.kyc.updateData({ loading: true });
      const fetchParam = data;
      const result = await APIService.awsRequest(
        "get",
        "/admin/kyc_record",
        fetchParam
      );
      let list = [];
      if (!result.error) {
        list = result;
      }
      actions.kyc.updateData({ list, loading: false });
    },
    async kycStatusUpdate(data, getState) {
      const { userId, createTime, status, message } = data;
      const kycStatusUpdateRes = await APIService.awsRequest(
        "put",
        "/admin/kyc_status",
        { userId, createTime, status, message }
      );
      if (!kycStatusUpdateRes.error) {
        notification.success({
          message: "Success",
          description: `kyc request with userId: ${userId} and createTime: ${createTime} has been ${status}`
        });
      }
    }
  }
};
