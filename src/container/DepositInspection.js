import { connect } from "mirrorx";
import DepositInspection from "Biz/Operation/DepositInspection";

export default connect(({ deposit }) => {
  return { deposit };
})(DepositInspection);
