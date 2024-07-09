const express = require("express");
const adminRouter = require("./admin");
const authRoutes = require("./auth");
const groupRouter = require("./group");
const meetiRouter = require("./meeti");
const passwordRouter = require("./password");
const profileRouter = require("./profile");

const userRouter = express.Router();

userRouter.use("/admin", adminRouter);
userRouter.use("/auth", authRoutes);
userRouter.use("/group", groupRouter);
userRouter.use("/meeti", meetiRouter);
userRouter.use("/password", passwordRouter);
userRouter.use("/profile", profileRouter);

module.exports = userRouter;
