import { connect } from "mirrorx";
import OverallStatistics from "Biz/Statistics/OverallStatistics";

export default connect(({ overallStatistics }) => {
  return { overallStatistics };
})(OverallStatistics);
