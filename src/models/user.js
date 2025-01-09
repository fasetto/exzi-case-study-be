export default class User {
  constructor({ _id, fullname, email }) {
    this._id = _id;
    this.fullname = fullname;
    this.email = email;
    this.walletIds = [];
  }
}
