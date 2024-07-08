const express = require("express");
const adminRouter = require("./admin");
const authRoutes = require("./auth");
const groupRouter = require("./group");
const meetiRouter = require("./meeti");

const userRouter = express.Router();

userRouter.use("/group", groupRouter);
userRouter.use("/auth", authRoutes);
userRouter.use("/admin", adminRouter);
userRouter.use("/meeti", meetiRouter);

module.exports = userRouter;
