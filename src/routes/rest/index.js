const express = require("express");
const authRouter = require("./auth");

const restRouter = express.Router();

restRouter.use("/auth", authRouter);

module.exports = restRouter;
