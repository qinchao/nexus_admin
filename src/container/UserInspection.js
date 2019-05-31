import { connect } from "mirrorx";
import UserInspection from "Biz/User/UserInspection";

export default connect(({ userInspection, kycInspection }) => {
  return { userInspection, kycInspection };
})(UserInspection);