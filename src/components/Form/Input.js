import React from "react";
import "./Input.less";
import FormStateContext from "./context";
import cx from "classnames";

class Input extends React.Component {
  render() {
    const { name, placeholder, className, ...props } = this.props;

    return (
      <FormStateContext.Consumer>
        {({ onChange, clearValidState, form }) => {
          const item = form[name];

          return (
            <input
              {...props}
              value={item.value}
              onChange={onChange}
              onFocus={clearValidState}
              className={cx("input", className)}
              name={name}
              type="text"
              placeholder={placeholder}
            />
          );
        }}
      </FormStateContext.Consumer>
    );
  }
}

export default Input;
