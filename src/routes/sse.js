import express from "express";
import { createSession } from "better-sse";

import sseChannel from "../sseChannel.js";
import { SseSchema } from "../validationSchemas/index.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const result = await SseSchema.safeParseAsync(req.body);

  if (!result.success) {
    const { fieldErrors } = result.error.flatten();

    return res.status(400).json({
      errors: fieldErrors,
    });
  }

  const { userId } = result.data;

  const session = await createSession(req, res, {
    state: { userId },
  });

  sseChannel.register(session);

  session.push({
    message: "Connected",
    timestamp: new Date().toISOString(),
  });
});

export default router;
