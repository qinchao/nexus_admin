import { connect } from "mirrorx";
import WithdrawStatistics from "Biz/Statistics/WithdrawStatistics";

export default connect(({ withdrawStatistics }) => {
  return { withdrawStatistics };
})(WithdrawStatistics);
