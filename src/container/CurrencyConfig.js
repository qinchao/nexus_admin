import { connect } from "mirrorx";
import CurrencyConfig from "Biz/Config/CurrencyConfig";

export default connect(({ currencyConfig }) => {
  return { currencyConfig };
})(CurrencyConfig);
