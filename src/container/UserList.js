import { connect } from "mirrorx";
import User from "Biz/User/User";

export default connect(({ userList }) => {
  return { userList };
})(User);