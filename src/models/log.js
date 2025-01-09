export default class Alert {
  constructor({ message, severity, timestamp }) {
    this.message = message;
    this.severity = severity; // info, low, medium, high, critical
    this.timestamp = timestamp;
  }
}
