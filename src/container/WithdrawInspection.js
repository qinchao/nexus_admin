import { connect } from "mirrorx";
import WithdrawInspection from "Biz/Operation/WithdrawInspection";

export default connect(({ withdrawInspection, userInspection }) => {
  return { withdrawInspection, userInspection };
})(WithdrawInspection);
