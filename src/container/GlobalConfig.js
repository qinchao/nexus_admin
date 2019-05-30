import { connect } from "mirrorx";
import GlobalConfig from "Biz/Config/GlobalConfig";

export default connect(({ globalConfig }) => {
  return { globalConfig };
})(GlobalConfig);