export default class Alert {
  constructor(message) {
    this.message = message;
  }

  send() {}
}

export class SmsAlert extends Alert {
  constructor(message) {
    super(message);
  }

  send() {
    // ..
  }
}

export class EmailAlert extends Alert {
  constructor(message) {
    super(message);
  }

  send() {
    // ..
  }
}
