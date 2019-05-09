import { connect } from "mirrorx";
import Index from "App/Index";

export default connect(({ user }) => {
  return { user };
})(Index);
