import { EventEmitter } from "node:events";

import LogService from "../services/logService.js";
import Log from "../models/log.js";
import { EmailAlert, SmsAlert } from "./alert.js";

class TransactionObserver extends EventEmitter {}

const transactionObserver = new TransactionObserver();

const logService = new LogService();

class HighValueTransactionRule {
  constructor() {
    this.treshold = 20;
  }

  async check(transaction) {
    if (transaction.amount < this.treshold) {
      return;
    }

    const message = `🚩 High-value transaction detected: $${transaction.amount} from ${transaction.from} to ${transaction.to}`;

    console.log(message);

    const log = new Log({
      message,
      severity: "high",
      timestamp: new Date(),
    });

    await logService.append(log);

    const alerts = [new SmsAlert(message), new EmailAlert(message)];

    alerts.forEach((alert) => alert.send());
  }
}

class TransactionMonitor {
  constructor(rules) {
    this.rules = rules;
  }

  async monitor(transaction) {
    for (const rule of this.rules) {
      await rule.check(transaction);
    }
  }
}

const transactionMonitor = new TransactionMonitor([
  new HighValueTransactionRule(),
]);

transactionObserver.on("transaction", async (transaction) => {
  await transactionMonitor.monitor(transaction);
});

export default transactionObserver;
