import React, { PureComponent } from "react";

import Header from "Container/Header";
import "./WithWrapBox.less";

function withWrapBox(WrappedComponent) {
  class withWrapBox extends PureComponent {
    render() {
      return (
        <div className="ctWrap">
          <Header {...this.props} />

          <div className="ctContainer">
            <div className="ctBody">
              <WrappedComponent {...this.props} />
            </div>
          </div>
        </div>
      );
    }
  }

  // Wrap the Display Name for Easy Debugging
  withWrapBox.displayName = `WithSubscription(${getDisplayName(
    WrappedComponent
  )})`;
  return withWrapBox;

  function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || "Component";
  }
}

export { withWrapBox };
