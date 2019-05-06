import React, { PureComponent } from "react";
import "./Popup.less";

class Pop extends PureComponent {
  state = { message: "" };
  render() {
    const { onClickSubmit, onClickCancel, children } = this.props;
    return (
      <div className="popup">
        <div className="popup_inner">
          {children}
          <div className="buttons">
            <button onClick={onClickSubmit}>Yes</button>
            <button onClick={onClickCancel}>Go Back</button>
          </div>
        </div>
      </div>
    );
  }
}

export default Pop;
