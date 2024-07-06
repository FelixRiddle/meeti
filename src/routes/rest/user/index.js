const express = require("express");

const groupRouter = require("./group");
const authRouter = require("../auth");
const meetiRouter = require("./meeti");
const adminRouter = require("./admin");

const userRouter = express.Router();

userRouter.use("/admin", adminRouter);
userRouter.use("/auth", authRouter);
userRouter.use("/group", groupRouter);
userRouter.use("/meeti", meetiRouter);

module.exports = userRouter;
