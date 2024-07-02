const express = require("express");
const adminRouter = require("./admin");
const groupRouter = require("./group");

const userRouter = express.Router();

userRouter.use("/group", groupRouter);
userRouter.use("/admin", adminRouter);

module.exports = userRouter;
