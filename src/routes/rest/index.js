const express = require("express");
const authRouter = require("./auth");
const groupRouter = require("./group");
const userRouter = require("./user");

const restRouter = express.Router();

restRouter.use("/auth", authRouter);
restRouter.use("/group", groupRouter);
restRouter.use("/user", userRouter);

module.exports = restRouter;
