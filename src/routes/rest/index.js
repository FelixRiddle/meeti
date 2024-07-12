const express = require("express");
const color = require("ansi-color");

const authenticateRest = require("../../lib/middleware/rest/authenticateRest");
const optionalAuthenticateRest = require("../../lib/middleware/rest/optionalAuthenticateRest");
const expandData = require("../../lib/misc/expandData");

const authRouter = require("./auth");
const groupRouter = require("./group");
const meetiRouter = require("./meeti");
const homeRouter = require("./home");
const userRouter = require("./user");
const usersRouter = require("./users");

const restRouter = express.Router();

restRouter.use("/auth", authRouter);
restRouter.use("/group", groupRouter);
restRouter.use("/home", homeRouter);
restRouter.use("/meeti", optionalAuthenticateRest, meetiRouter);
restRouter.use("/user", authenticateRest, userRouter);
restRouter.use("/users", usersRouter);

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
