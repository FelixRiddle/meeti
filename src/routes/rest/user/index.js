const express = require("express");

const groupRouter = require("./group");
const authRouter = require("../auth");
const meetiRouter = require("./meeti");

const userRouter = express.Router();

userRouter.use("/meeti", meetiRouter);
userRouter.use("/auth", authRouter);
userRouter.use("/group", groupRouter);

module.exports = userRouter;
