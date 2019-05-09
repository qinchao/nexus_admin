import { connect } from "mirrorx";
import KYCInspection from "Biz/KYC/KYCInspection";

export default connect(state => state.kycInspection)(KYCInspection);
