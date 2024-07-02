const express = require("express");
const adminRouter = require("./admin");

const userRouter = express.Router();

userRouter.use("/admin", adminRouter);

module.exports = userRouter;
