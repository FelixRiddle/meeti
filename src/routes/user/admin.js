const express = require("express");
const moment = require("moment");

const expandData = require("../../lib/misc/expandData");
const MeetiUtils = require("../../lib/models/MeetiUtils");

const adminRouter = express.Router();

adminRouter.get("/", async (req, res) => {
	try {
		const {
			Groups,
		} = req.models;
		
		// To meeti and participants
		const meetiUtils = new MeetiUtils(req.models, req.user);
		
		// Get meetis and groups
		const [groups, futureMeetis, pastMeetis] = await Promise.all([
			Groups.findAll({
				where: {
					userId: req.user.id,
				},
				order: [
					["date", "ASC"]
				]
			}),
			meetiUtils.meetiAndParticipants({
				meetisTime: "future"
			}),
			meetiUtils.meetiAndParticipants({
				meetisTime: "past"
			}),
		]);
		
		const extraData = await expandData(req);
		return res
			.render("user/admin", {
				title: "Admin dashboard",
				...extraData,
				groups,
				futureMeetis,
				pastMeetis,
				moment,
			});
	} catch(err) {
		console.error(err);
		
		req.flash("messages", [{
			message: "Internal error",
			type: "error"
		}]);
		
		const extraData = await expandData(req);
		return res
			.status(500)
			.render("user/admin", {
				title: "Admin dashboard",
				...extraData,
				moment,
			});
	}
});

module.exports = adminRouter;
