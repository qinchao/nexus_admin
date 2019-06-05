import { connect } from "mirrorx";
import SymbolConfig from "Biz/Config/SymbolConfig";

export default connect(({ symbolConfig }) => {
  return { symbolConfig };
})(SymbolConfig);
