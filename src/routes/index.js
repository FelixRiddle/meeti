const express = require("express");
const moment = require("moment");
const Sequelize = require("sequelize");

const authRouter = require("./auth");
const { pageNotFoundMessage } = require("../lib/status/messages");
const restRouter = require("./rest");
const userRouter = require("./user");
const userIsAuthenticated = require("../lib/auth/userIsAuthenticated");
const expandData = require("../lib/misc/expandData");
const error500Router = require("./500");

const Op = Sequelize.Op;

/**
 * Render home
 */
async function renderHome(req, res) {
	try {
		const {
			Groups,
			Meeti,
			SocialCategory,
			User,
		} = req.models;
		
		const [
			categories,
			lastMeetis
		] = await Promise.all([
			SocialCategory.findAll(),
			Meeti.findAll({
				where: {
					date: {
						[Op.gte]: moment(new Date()).format("YYYY-MM-DD")
					}
				},
				attributes: [
					"slug", "title", "date", "time", "id"
				],
				limit: 3,
				order: [
					["date", "ASC"]
				],
				include: [{
					model: Groups,
					attributes: ["image"]
				}, {
					model: User,
					attributes: ['id', 'name', 'pfp']
				}]
			})
		]);
		
		let meetis = [];
		for(const meeti of lastMeetis) {
			const newMeeti = meeti.get({raw: true});
			newMeeti.group = newMeeti.group.get({raw: true});
			newMeeti.user = newMeeti.user.get({raw: true});
			meetis.push(newMeeti);
		}
		
		const extraData = await expandData(req);
		return res.render("home", {
			title: "Home",
			...extraData,
			categories,
			meetis,
			moment,
		});
	} catch(err) {
		console.error(err);
		return res.redirect('500');
	}
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
