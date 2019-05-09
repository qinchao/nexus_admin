import { connect } from "mirrorx";
import KYC from "Biz/KYC/KYC";

export default connect(({ kyc }) => {
  return { kyc };
})(KYC);
