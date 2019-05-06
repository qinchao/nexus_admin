import { Auth } from "aws-amplify";
import { getLang } from "Utils/index";

// Why do we need two environment variables?
// Because NODE_ENV is coupled with webpack.config.xxx.js and xxx could only be
// dev or prod. But we want the staging mode be same as production, but using
// different backend.
const env = process.env.TARGET_ENV || process.env.NODE_ENV;

const AuthConfig = {
  development: {
    // REQUIRED - Amazon Cognito Region
    region: "us-west-2",
    // OPTIONAL - Amazon Cognito User Pool ID
    userPoolId: "us-west-2_55NardkW1",
    // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
    userPoolWebClientId: "167mjcrigjhgni7e7btivfpu4g"
  },
  apidev: {
    // REQUIRED - Amazon Cognito Region
    region: "us-west-2",
    // OPTIONAL - Amazon Cognito User Pool ID
    userPoolId: "us-west-2_jFJXk1Mvx",
    // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
    userPoolWebClientId: "2gpahnvhvhv2lv892ahnjp2v2n"
  },
  singapore: {
    // REQUIRED - Amazon Cognito Region
    region: "ap-southeast-1",
    // OPTIONAL - Amazon Cognito User Pool ID
    userPoolId: "ap-southeast-1_XVMANSvBI",
    // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
    userPoolWebClientId: "4r88frjnuhes67a83u3jidhll6"
  },
  production: {
    // REQUIRED - Amazon Cognito Region
    region: "ap-southeast-1",
    // OPTIONAL - Amazon Cognito User Pool ID
    userPoolId: "ap-southeast-1_mjbqvJK4n",
    // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
    userPoolWebClientId: "6mcoaqrq58l69400inpmekipck"
  }
}[env];

async function getHeader(isLogin = true) {
  if (!isLogin) {
    return {
      "x-timestamp": `${Date.now()}`,
      "Accept-Language": `${getLang()};q=0.9,en;q=0.8,zh-TW;q=0.7`,
      "Content-Type": "application/json"
    };
  }
  return {
    "x-timestamp": `${Date.now()}`,
    "Accept-Language": `${getLang()};q=0.9,en;q=0.8,zh-TW;q=0.7`,
    Authorization: (await Auth.currentSession()).idToken.jwtToken,
    "Content-Type": "application/json"
  };
}

// Amazon API Gateway
const AwsAPIEndpointsConfig = {
  development: [
    {
      name: "nexusapi",
      endpoint: "https://testapi.sophonex.com/web",
      region: "us-west-2",
      custom_header: getHeader
    }
  ],
  apidev: [
    {
      name: "nexusapi",
      endpoint: "https://c0ivbhd3ie.execute-api.us-west-2.amazonaws.com/apidev",
      region: "us-west-2",
      custom_header: getHeader
    }
  ],
  singapore: [
    {
      name: "nexusapi",
      endpoint: "https://apwapi.sophonex.com/web",
      region: "ap-southeast-1",
      custom_header: getHeader
    }
  ],
  production: [
    {
      name: "nexusapi",
      endpoint: "https://wapi.sophonex.com/web/",
      region: "ap-southeast-1",
      custom_header: getHeader
    }
  ]
}[env];

// REST API endpoint
const RestAPIEndpointsConfig = {
  development: {
    name: "sophonexapi",
    endpoint: "https://api.sophonex.com:8888",
    custom_header: getHeader
  },
  apidev: {
    name: "sophonexapi",
    endpoint: "https://api.sophonex.com:8888",
    custom_header: getHeader
  },
  singapore: {
    name: "sophonexapi",
    endpoint: "https://apapi.sophonex.com:8888",
    custom_header: getHeader
  },
  production: {
    name: "sophonexapi",
    endpoint: "https://api.sophonex.com:8888",
    custom_header: getHeader
  }
}[env];

const WSURL = {
  apidev: "ws://35.161.100.95:8080/ws",
  development: "wss://devws.sophonex.com:7777/ws",
  singapore: "wss://apws.sophonex.com:7777/ws",
  production: "wss://ws.sophonex.com:7777/ws"
}[env];

export { AuthConfig, AwsAPIEndpointsConfig, RestAPIEndpointsConfig, WSURL };
