import { connect } from "mirrorx";
import WithdrawInspection from "Biz/Withdraw/WithdrawInspection";

export default connect(({ withdrawInspection, userInspection }) => {
  return { withdrawInspection, userInspection };
})(WithdrawInspection);
