const express = require("express");
const authRouter = require("./auth");
const { pageNotFoundMessage } = require("../lib/status/messages");
const restRouter = require("./rest");
const userRouter = require("./user");
const userIsAuthenticated = require("../lib/auth/userIsAuthenticated");
const expandData = require("../lib/misc/expandData");

/**
 * Should all routes be functions?
 * 
 * I think they should've been from the start
 */
function mainRouter(passport) {
	const router = express.Router();
	
	router.use("/auth", authRouter(passport));
	router.use("/rest", restRouter);
	router.use(
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
	router.get("/home", renderHome);
	router.get("/", renderHome);
	
	router.use((req, res, next) => {
		return res.render("status", {
			title: pageNotFoundMessage.message,
			messages: [pageNotFoundMessage]
		});
	});
	
	return router;
}

module.exports = mainRouter;
