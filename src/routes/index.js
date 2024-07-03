const express = require("express");
const authRouter = require("./auth");
const { pageNotFoundMessage } = require("../lib/status/messages");
const restRouter = require("./rest");
const userRouter = require("./user");
const userIsAuthenticated = require("../lib/auth/userIsAuthenticated");
const expandData = require("../lib/misc/expandData");

const mainRouter = express.Router();

mainRouter.use("/auth", authRouter);
mainRouter.use("/rest", restRouter);
mainRouter.use(
	"/user",
	userIsAuthenticated,
	userRouter
);

const renderHome = (req, res) => {
	return res.render("home", {
		title: "Home",
		...expandData(req)
	});
}
mainRouter.get("/home", renderHome);
mainRouter.get("/", renderHome);

mainRouter.use((req, res, next) => {
	return res.render("status", {
		title: pageNotFoundMessage.message,
		messages: [pageNotFoundMessage]
	});
});

module.exports = mainRouter;
