import { connect } from "mirrorx";
import TradingStatistics from "Biz/Statistics/TradingStatistics";

export default connect(({ tradingStatistics }) => {
  return { tradingStatistics };
})(TradingStatistics);
