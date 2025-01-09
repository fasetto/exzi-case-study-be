import dotenv from "dotenv";
import express from "express";

import sseRouter from "./routes/sse.js";
import usersRouter from "./routes/users.js";
import walletsRouter from "./routes/wallets.js";
import transactionsRouter from "./routes/transactions.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/sse", sseRouter);
app.use("/api/users", usersRouter);
app.use("/api/wallets", walletsRouter);
app.use("/api/transactions", transactionsRouter);

app.use((req, res) => {
  return res.sendStatus(404);
});

export default app;
