import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Switch from "@material-ui/core/Switch";

const styles = theme => ({
  // switch styles
  iOSSwitchBase: {
    "&$iOSChecked": {
      color: theme.palette.common.white,
      "& + $iOSBar": {
        backgroundColor: "#36D58F",
        border: "solid 1px #36D58F"
      }
    },
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
      easing: theme.transitions.easing.sharp
    }),
    height: "40px"
  },
  iOSChecked: {
    transform: "translateX(15px)",
    "& + $iOSBar": {
      opacity: 1,
      border: "none"
    }
  },
  iOSBar: {
    borderRadius: 6,
    width: 22,
    height: 12,
    marginTop: -6,
    marginLeft: -14,
    border: "solid 1px #D8D8D8",
    backgroundColor: "#fff",
    opacity: 1,
    transition: theme.transitions.create(["background-color", "border"])
  },
  iOSIcon: {
    width: 8,
    height: 8,
    backgroundColor: "#909090",
    boxShadow: "none"
  },
  iOSIconChecked: {
    boxShadow: theme.shadows[1],
    marginLeft: "-12px",
    backgroundColor: "#fff"
  }
});

function SwitchBar({
  checkedValue,
  valueName,
  labelName,
  clickEvent,
  classes
}) {
  const labelStyle = {
    marginLeft: "-12px",
    verticalAlign: "middle"
  };

  return (
    <div>
      <Switch
        checked={checkedValue}
        onChange={clickEvent}
        value={valueName}
        classes={{
          switchBase: classes.iOSSwitchBase,
          bar: classes.iOSBar,
          icon: classes.iOSIcon,
          iconChecked: classes.iOSIconChecked,
          checked: classes.iOSChecked
        }}
      />
      {labelName ? <span style={labelStyle}>{labelName}</span> : null}
    </div>
  );
}

SwitchBar.propTypes = {
  classes: PropTypes.object.isRequired,
  checkedValue: PropTypes.bool.isRequired,
  valueName: PropTypes.string.isRequired,
  labelName: PropTypes.string,
  clickEvent: PropTypes.func.isRequired
};
SwitchBar.defaultProps = {
  labelName: ""
};

const SwitchWrapped = withStyles(styles)(SwitchBar);

export default SwitchWrapped;
