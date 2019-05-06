import { connect } from "mirrorx";
import KYCInspection from "App/KYC/KYCInspection";

export default connect(state => state.kycInspection)(KYCInspection);
