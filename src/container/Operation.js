import { connect } from "mirrorx";
import Operation from "appSrc/app/Operation";

export default connect(({ operation, user }) => {
  return { operation, user };
})(Operation);
