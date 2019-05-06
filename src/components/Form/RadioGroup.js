import React from "react";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormStateContext from "./context";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  root: {
    flexDirection: "row",
    marginLeft: "-9px",
    marginRight: "-9px"
  },
  formControl: {
    margin: theme.spacing.unit * 3
  },
  group: {
    margin: `${theme.spacing.unit}px 0`
  }
});

class FormRadioGroup extends React.Component {
  render() {
    const { name, label, classes } = this.props;

    return (
      <FormStateContext.Consumer>
        {({ onChange, clearValidState, form }) => {
          const item = form[name];

          return (
            <RadioGroup
              aria-label={label}
              name={name}
              classes={{
                root: classes.root
              }}
              value={item.value}
              onChange={event => {
                const obj = {
                  target: {
                    value: event.target.value,
                    name
                  }
                };
                clearValidState(obj);
                onChange(obj);
              }}
            >
              {this.props.children}
            </RadioGroup>
          );
        }}
      </FormStateContext.Consumer>
    );
  }
}

export default withStyles(styles)(FormRadioGroup);
