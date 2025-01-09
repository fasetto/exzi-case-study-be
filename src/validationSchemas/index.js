import { ObjectId } from "mongodb";
import { z } from "zod";

export const ObjectIdSchema = z.string().refine(ObjectId.isValid, {
  message: "Invalid Id",
});

export const SseSchema = z.object({
  userId: ObjectIdSchema,
});

export const WalletSchema = z.object({
  userId: ObjectIdSchema,
  currency: z.enum(["btc"]),
});

export const UserSchema = z.object({
  fullname: z.string(),
  email: z.string().email(),
});

export const TransactionSchema = z.object({
  senderWalletId: ObjectIdSchema,
  recipientWalletId: ObjectIdSchema,
  amount: z.number().gt(0),
});
