import { connect } from "mirrorx";
import APIResourceCost from "Biz/Config/APIResourceCost";

export default connect(({ apiResourceCost }) => {
  return { apiResourceCost };
})(APIResourceCost);
