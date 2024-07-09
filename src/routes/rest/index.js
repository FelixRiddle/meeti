const express = require("express");
const color = require("ansi-color");

const authRouter = require("./auth");
const groupRouter = require("./group");
const userRouter = require("./user");
const authenticateRest = require("../../lib/auth/rest/authenticateRest");
const expandData = require("../../lib/misc/expandData");

const restRouter = express.Router();

restRouter.use("/auth", authRouter);
restRouter.use("/group", groupRouter);
restRouter.use("/user", authenticateRest, userRouter);
restRouter.use(async (req, res) => {
	const message = "Page not found";
	console.log(color.set(message, "red"));
	req.flash("messages", [{
		message,
		type: "error"
	}]);
	
	const extraData = await expandData(req);
	return res.status(404).send({
		...extraData
	});
});

module.exports = restRouter;
