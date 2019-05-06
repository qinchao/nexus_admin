import React from "react";
import FormStateContext from "./context";
import "./FormGroup.less";
import cx from "classnames";

class FormGroup extends React.Component {
  render() {
    const { validateName, className } = this.props;
    return (
      <FormStateContext.Consumer>
        {({ form }) => {
          const item = form[validateName];

          return (
            <div className={cx("control", className)}>
              {this.props.children}
              {item && !item.valid && (
                <div className="form-error">{item.message}</div>
              )}
            </div>
          );
        }}
      </FormStateContext.Consumer>
    );
  }
}

export default FormGroup;
