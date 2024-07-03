const express = require("express");
const authRouter = require("./auth");
const groupRouter = require("./group");
const userRouter = require("./user");

const restRouter = express.Router();

restRouter.use("/auth", authRouter);
restRouter.use("/group", groupRouter);
restRouter.use("/user", (req, res, next) => {
	console.log(`Unsigned cookies: `, req.cookies);
	console.log(`Signed cookies: `, req.signedCookies);
	next();
}, userRouter);

module.exports = restRouter;
