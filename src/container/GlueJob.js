import { connect } from "mirrorx";
import GlueJob from "Biz/Dashboard/GlueJob";

export default connect(({ glueJob }) => {
  return { glueJob };
})(GlueJob);
