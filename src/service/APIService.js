import Axios from "axios";
import Amplify, { API, I18n } from "aws-amplify";
import { notification } from "antd";

import {
  AwsAPIEndpointsConfig,
  RestAPIEndpointsConfig,
  AuthConfig
} from "./Config";
import { getLang } from "Utils/index";

// login language
I18n.setLanguage(getLang());

Amplify.configure({
  // retrieve temporary AWS credentials and sign requests
  Auth: AuthConfig,
  endpoints: AwsAPIEndpointsConfig
});

// axios config
const axiosLogin = Axios.create({
  baseURL: RestAPIEndpointsConfig.endpoint,
  timeout: 15000
});

const axios = Axios.create({
  baseURL: RestAPIEndpointsConfig.endpoint,
  timeout: 15000
});

const axiosAwsWithoutLogin = Axios.create({
  baseURL: AwsAPIEndpointsConfig[0].endpoint,
  timeout: 15000
});

const ERROE_TEXT = "Something went wrong, please try again later.";

// successHandler: except awsRequest
const successHandler = (response, failCallback) => {
  if (response && response.data) {
    const data = response.data;
    if (data.error) {
      if (typeof failCallback === "function") {
        // failcallback
        failCallback(data.error);
      } else if (!failCallback) {
        // default snackbar tips
        // if don't want this default action, please delivery failcallback as empty function or empty object
        notification.error({
          message: "Error",
          description: data.error.message || ERROE_TEXT
        });
      }
    }
    return data.result ? data.result : data;
  } else {
    // data format returned by backend is incorrect.
    throw new Error("data format is incorrect!");
  }
};

const errorHandler = (err, failCallback) => {
  let message = err.message || ERROE_TEXT;
  const returnErr = { error: { code: -1, message } };

  if (err.response) {
    if (
      err.response.data &&
      (err.response.data.message || err.response.data.type)
    ) {
      message = err.response.data.message || err.response.data; // for snackbar msg
      Object.assign(returnErr.error, err.response, err.response.data);
    } else {
      Object.assign(returnErr.error, err.response);
    }
  }

  if (typeof failCallback === "function") {
    failCallback(returnErr.error);
    return returnErr;
  } else if (!failCallback) {
    // default snackbar tips
    // if don't want this default action, please delivery failcallback as empty function or empty object
    notification.error({
      message: "Error",
      description: message || ERROE_TEXT
    });
  }

  return returnErr;
};

// APIService
class _APIService {
  constructor() {
    this.APIGatewayEndpointsName = AwsAPIEndpointsConfig[0].name;
  }

  /**
   * request: rest api (need login)
   * request method: axios
   * response:
   * {
   *    headers: {}, request: {},
   *    config: {}, status: 200, statusText: "OK",
   *    data: {
   *        { result: ""}
   *        { error: { code: "", message: "" }}}
   *    }
   * }
   */
  async request(method, path, params, failCallback) {
    try {
      axiosLogin.defaults.headers = await RestAPIEndpointsConfig.custom_header();

      const paramsKey = method.toUpperCase() === "POST" ? "data" : "params";
      const response = await axiosLogin({
        method,
        url: path,
        [paramsKey]: params
      });

      return successHandler(response, failCallback);
    } catch (err) {
      console.error("get error: ", path, err);
      return errorHandler(err, failCallback);
    }
  }

  /**
   * requestWithoutLogin: rest api (without login)
   * request method: axios
   * response: as above
   */
  async requestWithoutLogin(method, path, params, failCallback) {
    try {
      axios.defaults.headers = await RestAPIEndpointsConfig.custom_header(
        false
      );
      const response = await axios({
        method,
        url: path,
        params
      });

      return successHandler(response, failCallback);
    } catch (err) {
      console.error("get error: ", path, err);
      return errorHandler(err, failCallback);
    }
  }

  /**
   * awsRequestWithoutLogin: aws api gateway (without login)
   * request method: axios
   * response: as above
   */
  async awsRequestWithoutLogin(
    method,
    path,
    params,
    failCallback,
    ...restOptions
  ) {
    try {
      axiosAwsWithoutLogin.defaults.headers = await RestAPIEndpointsConfig.custom_header(
        false
      );

      const response = await axiosAwsWithoutLogin({
        method,
        url: path,
        params,
        ...(restOptions.length ? restOptions[0] : {})
      });

      return successHandler(response, failCallback);
    } catch (err) {
      console.error("get error: ", path, err);
      return errorHandler(err, failCallback);
    }
  }

  /**
   * awsRequest: aws api gateway (login)
   * request method: AWS API
   * response: {
   *    { result: ""}
   *    { error: { code: "", message: ""}}
   * }
   */
  async awsRequest(method, path, params, failCallback, headers) {
    const init = params
      ? {
          [method === "post" ? "body" : "queryStringParameters"]: params,
          response: true
        }
      : { response: true };

    if (headers) {
      const custom_header = await RestAPIEndpointsConfig.custom_header();
      Object.assign(init, { headers: Object.assign(custom_header, headers) });
    }

    try {
      const response = await API[method](
        this.APIGatewayEndpointsName,
        path,
        init
      );

      return successHandler(response, failCallback);
    } catch (err) {
      console.error("get error: ", path, err);
      return errorHandler(err, failCallback);
    }
  }
}

const APIService = new _APIService();

export default APIService;
