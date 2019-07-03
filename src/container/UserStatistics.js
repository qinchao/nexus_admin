import { connect } from "mirrorx";
import UserStatistics from "biz/Statistics/UserStatistics";

export default connect(({ userList }) => {
  return { userList };
})(UserStatistics);
