import React from "react";
import { Link } from "mirrorx";

import "./NavTab.less";

function NavTab({ NavTabItems = [], navTabCur = "", clickEvent }) {
  return (
    <div className="ctNav">
      {NavTabItems.map(item => {
        return navTabCur === item.type ? (
          <div key={item.type} className="ctNavItem cur">
            {item.iconClass ? <i className={item.iconClass} /> : null}
            {item.title}
          </div>
        ) : (
          <Link key={item.type} className="ctNavItem" to={item.link}>
            <div
              onClick={() => {
                clickEvent(item.type);
              }}
            >
              {item.iconClass ? <i className={item.iconClass} /> : null}
              {item.title}
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default NavTab;
