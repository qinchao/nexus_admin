import { connect } from "mirrorx";
import KYC from "App/KYC/KYC";

export default connect(({ kyc, user }) => {
  return { kyc, user };
})(KYC);
