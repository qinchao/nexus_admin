import { connect } from "mirrorx";
import KYC from "Biz/Operation/KYC";

export default connect(({ kyc }) => {
  return { kyc };
})(KYC);
