import { connect } from "mirrorx";
import RateLimit from "Biz/Config/RateLimit";

export default connect(({ rateLimit }) => {
  return { rateLimit };
})(RateLimit);
