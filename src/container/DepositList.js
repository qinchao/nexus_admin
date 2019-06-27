import { connect } from "mirrorx";
import Deposit from "Biz/Operation/Deposit";

export default connect(({ withdraw, deposit }) => {
  return { withdraw, deposit };
})(Deposit);
