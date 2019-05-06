import React from "react";
import Select from "react-select";
import FormStateContext from "./context";

const selectStyles = {
  option: (styles, { isFocused, isSelected }) => {
    return {
      ...styles,
      backgroundColor: isSelected || isFocused ? "rgba(0, 0, 0, 0.13)" : "#fff",
      color: "#000000"
    };
  },
  placeholder: styles => {
    return {
      ...styles,
      fontSize: "14px",
      color: "#8D8B8B",
      letterSpacing: "-0.11px"
    };
  },
  singleValue: styles => {
    return {
      ...styles,
      margin: "0",
      fontSize: "14px",
      color: "#000"
    };
  },
  noOptionsMessage: styles => {
    return {
      ...styles,
      color: "white"
    };
  },
  valueContainer: styles => {
    return {
      ...styles,
      padding: "0 10px 0 10px",
      fontSize: "14px"
    };
  },
  menu: styles => {
    return {
      ...styles,
      backgroundColor: "#fff",
      fontSize: "14px",
      borderRadius: "0px",
      margin: "0px"
    };
  },
  menuList: styles => {
    return {
      ...styles,
      width: "100%",
      background: "#FFF",
      paddingTop: 0,
      paddingBottom: 0
    };
  },
  indicatorSeparator: styles => {
    return {
      ...styles,
      display: "none"
    };
  },
  dropdownIndicator: styles => {
    return {
      ...styles
    };
  },
  indicatorsContainer: styles => {
    return {
      ...styles,
      alignSelf: "center",
      paddingRight: "4px"
    };
  },

  control: (styles, { isFocused }) => ({
    borderRadius: "2px",
    flex: "1 1 auto",
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#ffffff",
    width: "100%",
    height: "40px",
    color: "white",

    outline: isFocused ? "none !important" : null,
    border: "1px solid rgba(0, 0, 0, 0.13)"
  })
};

class FormSelect extends React.Component {
  render() {
    const { placeholder, options, name, ...props } = this.props;

    return (
      <FormStateContext.Consumer>
        {({ onChange, clearValidState, form }) => {
          const item = form[name];

          return (
            <Select
              {...props}
              value={item.value}
              styles={{ ...selectStyles }}
              placeholder={placeholder}
              onChange={value => {
                const event = {
                  target: {
                    name,
                    value
                  }
                };

                clearValidState(event);
                onChange(event);
              }}
              options={options.map(item => ({
                value: item,
                label: item
              }))}
            />
          );
        }}
      </FormStateContext.Consumer>
    );
  }
}

export default FormSelect;
