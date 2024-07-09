const express = require("express");
const MeetiUtils = require("../../../lib/models/MeetiUtils");
const expandData = require("../../../lib/misc/expandData");

const adminRouter = express.Router();

/**
 * Emulate EJS frontend get admin route
 */
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
					userId: Number(req.user.id),
				}
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
			.send({
				title: "Admin dashboard",
				...extraData,
				groups,
				futureMeetis,
				pastMeetis,
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
			.send({
				title: "Admin dashboard",
				...extraData,
			});
	}
});

module.exports = adminRouter;
