import { connect } from "mirrorx";
import DepositStatistics from "Biz/Statistics/DepositStatistics";

export default connect(({ depositStatistics }) => {
  return { depositStatistics };
})(DepositStatistics);
