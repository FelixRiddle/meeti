const express = require("express");
const moment = require("moment");

const expandData = require("../../lib/misc/expandData");
const MeetiUtils = require("../../lib/models/MeetiUtils");

const adminRouter = express.Router();

adminRouter.get("/", async (req, res) => {
	const {
		Groups,
	} = req.models;
	
	// To meeti and participants
	const meetiUtils = new MeetiUtils(req.models, req.user);
	
	// Get meetis and groups
	const [groups, meetis] = await Promise.all([
		Groups.findAll({
			where: {
				userId: req.user.id,
			}
		}),
		meetiUtils.meetiAndParticipants()
	]);
	
	console.log(`Meetis: `, meetis);
	
	return res
		.render("user/admin", {
			title: "Admin dashboard",
			...expandData(req),
			groups,
			meetis,
			moment,
		});
});

module.exports = adminRouter;
