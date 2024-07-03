const express = require("express");
const groupRouter = require("./group");
const authRouter = require("../auth");

const userRouter = express.Router();

userRouter.use("/auth", authRouter);
userRouter.use("/group", groupRouter);

module.exports = userRouter;
