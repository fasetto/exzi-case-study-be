import express from "express";

import User from "../models/user.js";
import UserService from "../services/userService.js";
import { UserSchema } from "../validationSchemas/index.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const validationResult = await UserSchema.safeParseAsync(req.body);

  if (!validationResult.success) {
    const { fieldErrors } = validationResult.error.flatten();

    return res.status(400).json({
      errors: fieldErrors,
    });
  }

  const user = new User({
    ...validationResult.data,
  });

  const userService = new UserService();
  await userService.createNew(user);

  return res.sendStatus(201);
});

export default router;
