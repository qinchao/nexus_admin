import { connect } from "mirrorx";
import UserWrap from "App/UserWrap";

export default connect(({ user }) => {
  return { user };
})(UserWrap);
