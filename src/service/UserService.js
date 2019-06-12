/* eslint-disable no-console */

import { Auth, Hub } from "aws-amplify";

import Event from "events";
const event = new Event();

class UserService {
  constructor() {
    Hub.listen("auth", this);
  }

  /**
   *
   * @param ev either "signOut" or "signIn"
   * @param callback
   */
  on(ev, callback) {
    event.on(ev, callback);
  }

  /**
   *
   * @param ev either "signOut" or "signIn"
   * @param callback
   */
  off(ev, callback) {
    // event.off(ev, data);
    event.removeListener(ev, callback);
  }

  /**
   * If not signed in, return null.
   *
   * @returns {Promise<void>}
   */
  async getCurrentUser() {
    try {
      return await Auth.currentAuthenticatedUser();
    } catch (err) {
      return null;
    }
  }

  async getIdToken() {
    try {
      let session = await Auth.currentSession();
      return session ? session.idToken.jwtToken : null;
    } catch (err) {
      return null;
    }
  }

  async signOut() {
    await Auth.signOut();
  }

  /**
   * getUserData
   *
   * @returns {Promise<void>}
   * @returns UserAttributes: []
   * @returns UserMFASettingList: ["SMS_MFA"]
   * @returns Username: "5172d50d-c12e-4203-8c1f-b0179e022a6b"
   */
  async getUserData(user = null, bypassCache = false) {
    if (!user) {
      user = await Auth.currentAuthenticatedUser();
      if (!user) {
        return null;
      }
    }
    return new Promise((res, rej) => {
      user.getUserData(
        (err, data) => {
          if (err) {
            rej(err);
          } else {
            res(data);
          }
        },
        { bypassCache }
      );
    });
  }

  /**
   * setMfaPreference
   *
   * @param {*} user
   * @param {*} smsMfaSettings
   * @param {*} totpMfaSettings
   */
  async setMfaPreference(
    user = null,
    smsMfaSettings = null,
    totpMfaSettings = null
  ) {
    if (!user) {
      user = await Auth.currentAuthenticatedUser();
      if (!user) {
        return null;
      }
    }
    return new Promise((res, rej) => {
      user.setUserMfaPreference(smsMfaSettings, totpMfaSettings, function(
        err,
        result
      ) {
        if (err) {
          rej(err);
        } else {
          res(result);
        }
      });
    });
  }

  /**
   * getMfaSetting
   *
   * @param {*} userData || null
   */
  async getMfaSetting(userData) {
    if (!userData) {
      userData = await this.getUserData(null, true);
      if (!userData) {
        return null;
      }
    }

    let mfaSMS = false,
      mfaTOTP = false;

    if (
      userData.UserMFASettingList &&
      userData.UserMFASettingList.includes("SMS_MFA")
    ) {
      mfaSMS = true;
    }
    if (
      userData.UserMFASettingList &&
      userData.UserMFASettingList.includes("SOFTWARE_TOKEN_MFA")
    ) {
      mfaTOTP = true;
    }

    const mfaSetting = { mfaSMS, mfaTOTP };

    return mfaSetting;
  }

  // Private methods
  onHubCapsule(capsule) {
    switch (capsule.payload.event) {
      case "signIn":
        event.emit("signIn");
        break;
      case "signOut":
        event.emit("signOut");
        break;
      default:
        break;
    }
  }
}

const service = new UserService();

export default service;
