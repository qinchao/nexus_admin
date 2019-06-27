import { connect } from "mirrorx";
import Withdraw from "Biz/Operation/Withdraw";

export default connect(({ withdraw }) => {
  return { withdraw };
})(Withdraw);
