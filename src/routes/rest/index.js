const express = require("express");
const authRouter = require("./auth");
const groupRouter = require("./group");

const restRouter = express.Router();

restRouter.use("/group", groupRouter);
restRouter.use("/auth", authRouter);

module.exports = restRouter;
