import { actions } from "mirrorx";
import APIService from "Service/APIService";

export default {
  name: "kycInspection",
  initialState: {
    kycInfo: {},
    reviewHistory: [],
    inspect: false,
    createTime: "",
    loading: true,
    frontImage: "",
    backImage: "",
    humanImage: ""
  },
  reducers: {
    updateData(state, data) {
      return { ...state, ...data };
    }
  },
  effects: {
    async initKyc(data, getState) {
      actions.kycInspection.updateData({ loading: true });
      let userId = data;
      let kycRecord = await APIService.awsRequest("get", "/admin/kyc_record", {
        userId
      });
      if (!kycRecord.error) {
        await actions.kycInspection.updateData({ reviewHistory: kycRecord });
        actions.kycInspection.getCurrentKycProfile();
        actions.kycInspection.initImages();
      }
      actions.kycInspection.updateData({ loading: false });
    },
    getCurrentKycProfile(data, getState) {
      let {
        kycInspection: { reviewHistory, createTime }
      } = getState();
      createTime = parseInt(createTime);
      if (!reviewHistory.length) {
        return;
      }
      if (reviewHistory[0].createTime === createTime) {
        actions.kycInspection.updateData({ kycInfo: reviewHistory[0] });
        return;
      }
      let l = 0,
        r = reviewHistory.length;
      while (l < r) {
        let mid = l + parseInt((r - l) / 2);
        let curCreateTime = reviewHistory[mid].createTime;
        if (curCreateTime === createTime) {
          actions.kycInspection.updateData({ kycInfo: reviewHistory[mid] });
          return;
        } else if (curCreateTime > createTime) {
          l = mid + 1;
        } else {
          r = mid;
        }
      }
    },
    async initImages(data, getState) {
      const {
        kycInspection: { kycInfo }
      } = getState();
      const { frontImageUrl, backImageUrl, humanImageUrl } = kycInfo;
      let promises = [
        APIService.awsRequest("get", "/admin/kyc_image", {
          imageURL: frontImageUrl
        }),
        APIService.awsRequest("get", "/admin/kyc_image", {
          imageURL: backImageUrl
        }),
        APIService.awsRequest("get", "/admin/kyc_image", {
          imageURL: humanImageUrl
        })
      ];
      await Promise.all(promises).then(images => {
        if (!images[0].error) {
          actions.kycInspection.updateData({ frontImage: images[0] });
        }
        if (!images[1].error) {
          actions.kycInspection.updateData({ backImage: images[1] });
        }
        if (!images[2].error) {
          actions.kycInspection.updateData({ humanImage: images[2] });
        }
      });
    }
  }
};
