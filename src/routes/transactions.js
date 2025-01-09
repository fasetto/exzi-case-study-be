import express from "express";
import { TransactionSchema } from "../validationSchemas/index.js";
import TransactionService from "../services/transactionService.js";
import WalletService from "../services/walletService.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const validationResult = await TransactionSchema.safeParseAsync(req.body);

  if (!validationResult.success) {
    const { fieldErrors } = validationResult.error.flatten();

    return res.status(400).json({ errors: fieldErrors });
  }

  const { senderWalletId, recipientWalletId, amount } = validationResult.data;

  try {
    const walletService = new WalletService();

    const senderWallet = await walletService.getWalletById(senderWalletId);
    const recipientWallet = await walletService.getWalletById(
      recipientWalletId
    );

    const transactionService = new TransactionService();

    try {
      const txId = await transactionService.create({
        senderWallet,
        recipientWallet,
        amount,
      });

      return res.json({ txId });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  } catch {
    return res.sendStatus(500);
  }
});

export default router;
