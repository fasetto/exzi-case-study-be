import express from "express";
import { TransferSchema } from "../validationSchemas/index.js";
import TransferService from "../services/transferService.js";
import WalletService from "../services/walletService.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const validationResult = await TransferSchema.safeParseAsync(req.body);

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

    const transferService = new TransferService();

    const txId = await transferService.createTransaction({
      senderWallet,
      recipientWallet,
      amount,
    });

    return res.json({ txId });
  } catch {
    return res.sendStatus(500);
  }
});

export default router;
