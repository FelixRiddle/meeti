const express = require("express");

const authRouter = require("./auth");
const { pageNotFoundMessage } = require("../lib/status/messages");
const restRouter = require("./rest");
const userRouter = require("./user");
const userIsAuthenticated = require("../lib/auth/userIsAuthenticated");
const expandData = require("../lib/misc/expandData");
const error500Router = require("./500");

/**
 * Render home
 */
async function renderHome(req, res) {
	const {
		SocialCategory
	} = req.models;
	
	const [
		categories
	] = await Promise.all([
		SocialCategory.findAll()
	]);
	
	const extraData = await expandData(req);
	return res.render("home", {
		title: "Home",
		...extraData,
		categories,
	});
}

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
	router.use("/500", error500Router);
	
	router.get("/home", renderHome);
	router.get("/", renderHome);
	
	// 404
	router.use(async (req, res, next) => {
		const extraData = await expandData(req);
		return res.render("status", {
			title: pageNotFoundMessage.message,
			...extraData,
			messages: [pageNotFoundMessage],
		});
	});
	
	return router;
}

module.exports = mainRouter;
