export default class Transfer {
  constructor({ _id, txId, from, to, amount, timestamp }) {
    this._id = _id;
    this.txId = txId;
    this.from = from;
    this.to = to;
    this.amount = amount;
    this.timestamp = timestamp;
  }
}
