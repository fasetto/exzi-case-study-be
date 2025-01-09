import { ObjectId } from "mongodb";

export default class Wallet {
  constructor({ _id, userId, publicKey, privateKey, address, balance = 0 }) {
    this._id = _id;

    if (typeof userId === "string") {
      this.userId = ObjectId.createFromHexString(userId);
    } else {
      this.userId = userId;
    }

    this.publicKey = publicKey;
    this.privateKey = privateKey;
    this.currency = "btc";
    this.balance = balance;
    this.address = address;
  }

  addFunds(amount) {
    this.balance += amount;
  }

  deductFunds(amount) {
    this.balance -= amount;
  }
}
