import { connect } from "mirrorx";
import KYCInspection from "Biz/Operation/KYCInspection";

export default connect(state => state.kycInspection)(KYCInspection);
