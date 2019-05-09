import { connect } from "mirrorx";
import Withdraw from "App/Withdraw/Withdraw";

export default connect(({ withdraw, user }) => {
  return { withdraw, user };
})(Withdraw);
