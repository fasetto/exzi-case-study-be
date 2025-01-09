import { z } from "zod";

export const SseSchema = z.object({
  userId: z.string(),
});

export const WalletSchema = z.object({
  userId: z.string(),
  currency: z.enum(["btc"]),
});

export const UserSchema = z.object({
  fullname: z.string(),
  email: z.string().email(),
});

export const TransferSchema = z.object({
  senderWalletId: z.string(),
  recipientWalletId: z.string(),
  amount: z.number().gt(0),
});
