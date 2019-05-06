import React from "react";
import FormStateContext from "./context";

const validators = {
  required: {
    test: value => {
      return typeof value === "string" ? value.trim() !== "" : !!value;
    },
    message: () => {
      return "this field is required";
    }
  }
};

class Form extends React.Component {
  validate(options = {}) {
    const { form } = this.props.formState;

    const result = {};
    let formValid = true;

    const exclude = options.exclude;

    Object.getOwnPropertyNames(form).forEach(name => {
      const item = form[name];
      let validateResult = false;
      let message = "";

      if (exclude && exclude.includes(name)) {
        return;
      }

      if (item.required) {
        validateResult = validators.required.test(item.value);
        message = validators.required.message(item);
      }

      if (item.customValidator) {
        validateResult = item.customValidator(item.value);

        if (validateResult !== true) {
          message = validateResult.message;
          validateResult = false;
        }
      }

      if (!validateResult) {
        formValid = false;
      }

      result[name] = {
        ...form[name],
        valid: validateResult,
        message
      };
    });

    return {
      formValidateResult: result,
      formValid
    };
  }

  render() {
    return (
      <FormStateContext.Provider value={this.props.formState}>
        <div className={this.props.className}>{this.props.children}</div>
      </FormStateContext.Provider>
    );
  }
}

export default Form;
