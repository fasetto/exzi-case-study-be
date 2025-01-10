import express from "express";

import WalletService from "../services/walletService.js";
import { WalletSchema } from "../validationSchemas/index.js";
import { ObjectId } from "mongodb";

const router = express.Router();

router.post("/", async (req, res) => {
  const validationResult = await WalletSchema.safeParseAsync(req.body);

  if (!validationResult.success) {
    const { fieldErrors } = validationResult.error.flatten();

    return res.status(400).json({
      errors: fieldErrors,
    });
  }

  const { userId } = validationResult.data;

  const walletService = new WalletService();

  try {
    await walletService.createNew(userId);
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }

  return res.sendStatus(201);
});

router.get("/", async (req, res) => {
  const walletService = new WalletService();

  const userId = req.query?.userId;

  const isValid = ObjectId.isValid(userId);

  if (!isValid) {
    return res.status(400).json({
      message: "Invalid userId",
    });
  }

  if (!userId) {
    return res.status(400).json({
      message: "userId is required",
    });
  }

  const wallets = await walletService.getWallets(userId);

  return res.json(wallets);
});

router.get("/:walletId", async (req, res) => {
  const walletService = new WalletService();

  const walletId = req.params.walletId;

  const isValid = ObjectId.isValid(walletId);

  if (!isValid) {
    return res.status(400).json({
      message: "Invalid walletId",
    });
  }

  const wallet = await walletService.getWalletById(walletId);

  if (!wallet) {
    return res.sendStatus(404);
  }

  return res.json(wallet);
});

export default router;
