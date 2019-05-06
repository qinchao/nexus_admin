import React from "react";
import { NavLink } from "mirrorx";

import "./NavTabWithSub.less";

function NavTabWithSub({ NavTabItems = [], navTabCur = "", clickEvent }) {
  return (
    <div className="ctNav">
      {NavTabItems.map(item => {
        return navTabCur.includes(item.type) ? (
          <div className="navSelect" key={item.type}>
            <div className="ctNavItem cur">
              {item.iconClass ? <i className={item.iconClass} /> : null}
              {item.title}
            </div>
            <div className="subNav">
              {item.subTabs.length
                ? item.subTabs.map(item => {
                    return (
                      <NavLink
                        key={item.type}
                        to={item.link}
                        activeClassName="selected"
                        onClick={() => {
                          clickEvent(item.type);
                        }}
                      >
                        <div className="ctNavItem">
                          {item.iconClass ? (
                            <i className={item.iconClass} />
                          ) : null}
                          {item.title}
                        </div>
                      </NavLink>
                    );
                  })
                : ""}
            </div>
          </div>
        ) : (
          <div key={item.type}>
            {item.subTabs.length ? (
              <div className="navSelect">
                <div className="ctNavItem" key={item.type}>
                  {item.iconClass ? <i className={item.iconClass} /> : null}
                  {item.title}
                </div>
                <div className="subNav">
                  {item.subTabs.map(item => {
                    return (
                      <NavLink
                        key={item.type}
                        to={item.link}
                        activeClassName="selected"
                        onClick={() => {
                          clickEvent(item.type);
                        }}
                      >
                        <div className="ctNavItem">
                          {item.iconClass ? (
                            <i className={item.iconClass} />
                          ) : null}
                          {item.title}
                        </div>
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div
                className="ctNavItem"
                key={item.type}
                onClick={() => {
                  clickEvent(item.type);
                }}
              >
                {item.iconClass ? <i className={item.iconClass} /> : null}
                {item.title}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default NavTabWithSub;
