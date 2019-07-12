import { connect } from "mirrorx";
import DashboardWrap from "App/DashboardWrap";

export default connect(({ user }) => {
  return { user };
})(DashboardWrap);
