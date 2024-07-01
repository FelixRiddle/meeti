const express = require("express");
const authRouter = require("./auth");
const { pageNotFoundMessage } = require("../lib/status/messages");

const mainRouter = express.Router();

mainRouter.use("/auth", authRouter);

const renderHome = (req, res) => {
	return res.render("home", {
		title: "Home"
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
