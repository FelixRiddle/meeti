const express = require("express");
const groupRouter = require("./group");

const userRouter = express.Router();

userRouter.use("/group", groupRouter);

module.exports = userRouter;
