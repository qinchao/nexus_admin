import React from "react";
// import Radio from "@material-ui/core/Radio";
// import { withStyles } from "@material-ui/core/styles";
import { Radio } from "antd";

import { ReactComponent as RadioIcon } from "Img/radio.svg";
import { ReactComponent as RadioCheckedIcon } from "Img/radio_checked.svg";

const radioIcon = <RadioIcon />;
const radioCheckedIcon = <RadioCheckedIcon />;

// const CustomRadioStyles = {
//   root: {
//     padding: "9px 9px 10px"
//   }
// };

class CustomRadio extends React.Component {
  render() {
    return (
      <Radio icon={radioIcon} {...this.props} checkedIcon={radioCheckedIcon} />
    );
  }
}

// export default withStyles(CustomRadioStyles)(CustomRadio);
export default CustomRadio;
