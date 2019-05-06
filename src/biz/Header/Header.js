import React, { PureComponent } from "react";
import { actions, NavLink } from "mirrorx";

import logoImg from "Img/logo.svg";
import logoImgWhite from "Img/logo_medium.svg";
import "./Header.less";

class Header extends PureComponent {
  render() {
    const { user, match, white } = this.props;
    const userEmail = (user && user.userEmail) || "";

    let NAV_DEFAULT = [
      {
        path: "/operation",
        name: "Operation"
      }
    ];

    let NAV_USER_ACCOUNT = [
      {
        path: "/user/account",
        name: `${userEmail}`
      }
    ];

    let isAdmin =
      user &&
      user.cognitoGroup &&
      (user.cognitoGroup.includes("KycAdmin") ||
        user.cognitoGroup.includes("WalletAdmin"));
    if (isAdmin) {
      NAV_USER_ACCOUNT.push({
        path: "/operation",
        name: "Admin"
      });
    }

    NAV_USER_ACCOUNT.push({
      actions: "signOut",
      name: "SignOut"
    });

    return (
      <div className={`headerWrap ${white ? "white container" : "dark"}`}>
        <div className="navList">
          <NavLink to="/" className="logo">
            <img src={white ? logoImg : logoImgWhite} alt="sophon-logo" />
          </NavLink>
          {NAV_DEFAULT.map((item, i) => {
            return (
              <NavLink
                key={"NAV_DEFAULT" + i}
                className="navItem"
                to={item.path}
                activeClassName={item.path === match.path ? "selected" : ""}
              >
                {item.name}
              </NavLink>
            );
          })}
        </div>

        <div className="navList navRight">
          <div className="navSelect navItem">
            <div
              className={
                "navText " + (match.url.indexOf("account") >= 0 && "selected")
              }
            >
              Account
              <span />
            </div>
            <div className={userEmail ? "subNav right" : "subNav"}>
              {NAV_USER_ACCOUNT.map((accountItem, i) => {
                return accountItem.path ? (
                  <NavLink
                    className="subNavItem"
                    key={"NAV_USER_ACCOUNT" + i}
                    to={accountItem.path}
                  >
                    {accountItem.name}
                  </NavLink>
                ) : (
                  <span
                    className="subNavItem"
                    key={"NAV_USER_ACCOUNT" + i}
                    onClick={() => actions.user.signOut()}
                  >
                    {accountItem.name}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Header;
