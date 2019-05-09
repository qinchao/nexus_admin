import { connect } from "mirrorx";
import Withdraw from "Biz/Withdraw/Withdraw";

export default connect(({ withdraw }) => {
  return { withdraw };
})(Withdraw);
