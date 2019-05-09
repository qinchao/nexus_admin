import React, { Component } from "react";
import { actions, Link } from "mirrorx";
import axios from "axios";
import { parse } from "qs";
import { Authenticator } from "aws-amplify-react";
import { notification } from "antd";

import { getClientType } from "Utils/index";
import APIService from "Service/APIService";
import "./gt";
import { ReactComponent as LogoImgBlack } from "Img/logo.svg";
import MyTheme from "./MyTheme";

const authStateEnum = {
  SIGN_IN: "signIn",
  SIGN_UP: "signUp",
  SIGNED_IN: "signedIn",
  SIGNED_OUT: "signedOut",
  SIGNED_UP: "signedUp"
};

class Login extends Component {
  componentDidMount() {
    this._isMounted = true;
    this.initGt();
  }

  componentWillUnmount() {
    if (this.cancelSource) {
      this.cancelSource.cancel();
    }

    this._isMounted = false;
    this.captchaObj = null;
  }

  isGeeOff() {
    const { location } = this.props;

    if (location.search === 0) {
      return false;
    }

    const query = parse(location.search.slice(1));

    return query.geeOff === "1";
  }

  state = {};

  static getDerivedStateFromProps(props, state) {
    const { search } = props.location;
    const { path } = props.match;
    let authState;

    if (search.length > 1) {
      const query = parse(search.slice(1));
      authState = query.authState;
    }

    if (!authState) {
      authState =
        path.indexOf("register") >= 0
          ? authStateEnum.SIGN_UP
          : authStateEnum.SIGN_IN;
    }

    return {
      authState
    };
  }

  signInComponentRef = React.createRef();
  signUpComponentRef = React.createRef();

  getCurrentAuthComponent() {
    const { authState } = this.state;
    const currentAuthComponent =
      authStateEnum.SIGN_UP === authState
        ? this.signUpComponentRef.current
        : this.signInComponentRef.current;

    return currentAuthComponent;
  }

  toggleLoadigState(value) {
    const currentAuthComponent = this.getCurrentAuthComponent();

    if (currentAuthComponent) {
      currentAuthComponent.setState({ loading: value });
    }
  }

  isNeedGt() {
    const { authState } = this.state;

    if (this.isGeeOff()) {
      return false;
    }

    if (
      [
        authStateEnum.SIGN_IN,
        authStateEnum.SIGN_UP,
        authStateEnum.SIGNED_OUT,
        authStateEnum.SIGNED_UP
      ].includes(authState)
    ) {
      return true;
    } else {
      return false;
    }
  }

  initGt = () => {
    if (this.isNeedGt()) {
      if (this.captchaObj) {
        return;
      }

      this.doInitGt();
    }
  };

  doInitGt = async () => {
    this.initGtIng = true;
    this.toggleLoadigState(true);

    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    this.cancelSource = source;

    const resp = await APIService.awsRequestWithoutLogin(
      "get",
      "/gt/register",
      {
        t: new Date().getTime(),
        client_type: getClientType()
      },
      () => {},
      {
        cancelToken: source.token
      }
    );

    this.cancelSource = null;

    if (resp.error) {
      if (!axios.isCancel(resp.error)) {
        this.toggleLoadigState(false);
      }
      return;
    }

    const data = resp;

    return new Promise((resolve, reject) => {
      window.initGeetest(
        {
          gt: data.gt,
          new_captcha: data.new_captcha,
          challenge: data.challenge,
          offline: !data.success,
          product: "bind",
          lang: "en",
          type: "fullpage",
          fallback_config: {
            // the default fallback_config is problematical, override it
            fullpage: {
              static_servers: ["static.geetest.com", "dn-staticdown.qbox.me"],
              type: "fullpage",
              fullpage: "/static/js/fullpage.8.7.0.js", // latest version
              slide: "/static/js/slide.7.5.3.js"
            }
          },
          onError: () => {
            this.handleCaptchaError();

            reject();
          }
        },
        captchaObj => {
          if (!this._isMounted) {
            return;
          }

          this.toggleLoadigState(false);

          this.captchaObj = captchaObj;

          captchaObj.onSuccess(async () => {
            this.toggleLoadigState(true);

            const result = this.captchaObj.getValidate();
            const resp = await APIService.awsRequestWithoutLogin(
              "POST",
              "/gt/validate",
              result
            );

            if (resp.error) {
              this.toggleLoadigState(false);
              return;
            }

            if (resp === true) {
              const currentAuthComponent = this.getCurrentAuthComponent();
              const method = currentAuthComponent["signIn"]
                ? "signIn"
                : "signUp";
              currentAuthComponent[method](false);
            } else {
              this.toggleLoadigState(false);
              this.captchaObj.reset();
            }
          });

          captchaObj.onError(() => {
            this.handleCaptchaError();
          });

          resolve();
        }
      );
    });
  };

  handleCaptchaError = () => {
    this.toggleLoadigState(false);
    notification.error({
      message: "Error",
      description: "Something went wrong, please try again later."
    });
  };

  willSubmit = () => {
    if (!this.isNeedGt()) {
      return true;
    }

    if (!this.captchaObj) {
      // failed to initGeetest, so try again
      this.doInitGt().then(() => {
        this.captchaObj && this.captchaObj.verify();
      });

      return {
        message: "Please wait for geetest to finish initialization"
      };
    }

    this.captchaObj.verify();
  };

  handleAuthStateChange(authState) {
    if (!this._isMounted) return;

    if (authState === this.state.authState) {
      return;
    }

    if (authState === authStateEnum.SIGNED_IN) {
      actions.routing.push("/operation");
      return;
    }

    actions.routing.replace(
      "/login?authState=" + encodeURIComponent(authState)
    );
  }

  render() {
    const map = message => {
      if (/incorrect.*username.*password/i.test(message)) {
        return "Incorrect email or password";
      }
      return message;
    };

    const { authState } = this.state;

    return (
      <div className="loginWrap">
        <div className="loginHeader">
          <Link to="/operation" className="logo p-relative">
            <LogoImgBlack width="170" height="38" />
            <span className="betaIcon" />
          </Link>
        </div>
        <div className="loginBox">
          <Authenticator
            authState={authState}
            theme={MyTheme}
            errorMessage={map}
            onStateChange={authState => this.handleAuthStateChange(authState)}
          />
        </div>
      </div>
    );
  }
}

export default Login;
