import { connect } from "mirrorx";
import OperationWrap from "App/OperationWrap";

export default connect(({ user }) => {
  return { user };
})(OperationWrap);
