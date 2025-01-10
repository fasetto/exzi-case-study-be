# Getting Started

## Project Structure

```
📦
├─ __tests__
├─ src/
│  ├─ lib/
│  ├─ models/
│  ├─ routes/
│  ├─ services/
│  ├─ validationSchemas/
│  ├─ app.js
│  └─ sseChannel.js
├─ package.json
├─ Dockerfile
├─ docker-compose.yaml
└─ server.js
```

## Running on local

Prefer docker to run the project on local. An example env file is present in the project root folder.

```
cp .env.example .env
docker compose up -d
```

Also npm scripts can be used:

- npm run dev
- npm run test
- npm run start

![image](https://github.com/user-attachments/assets/8aadd3a2-67ff-482b-b957-d3149540a17b)

## Api Endpoints

- /api/sse (server-sent events)
- POST /api/users
- GET, POST, /api/wallets
- GET /api/wallets/:walletId
- GET, POST /api/transactions
- GET /api/transactions/:txId

First add users to database using the api. And create wallets for them.
Then transactions can be created.

Frontend clients can receive real-time events using the server-sent events via /api/sse endpoint.

## Monitoring & Alert System

TransactionMonitor monitors every transaction. For example, HighValueTransactionRule class is used for monitoring high value transactions and sending alerts (sms, email).

```js
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
```
