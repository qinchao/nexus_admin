import React from "react";
import cx from "classnames";
import "./Loading.less";

function Loading({ className }) {
  return (
    <div className={cx("spinner", className)}>
      <div className="bounce1" />
      <div className="bounce2" />
      <div className="bounce3" />
    </div>
  );
}

export default Loading;
