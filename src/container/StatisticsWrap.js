import { connect } from "mirrorx";
import StatisticsWrap from "App/StatisticsWrap";

export default connect(({ user }) => {
  return { user };
})(StatisticsWrap);
