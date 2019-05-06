import { connect } from "mirrorx";
import WithdrawInspection from "App/Withdraw/WithdrawInspection";

export default connect(({ withdrawInspection }) => {
  return { withdrawInspection };
})(WithdrawInspection);
