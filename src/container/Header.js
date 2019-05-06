import mirror, { connect } from "mirrorx";
import Header from "Biz/Header/Header";
import userModel from "Model/User";

mirror.model(userModel);

export default connect(({ user }) => {
  return { user };
})(Header);
