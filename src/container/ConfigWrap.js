import { connect } from "mirrorx";
import ConfigWrap from "App/ConfigWrap";

export default connect(({ user }) => {
  return { user };
})(ConfigWrap);
