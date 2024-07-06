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
		const [groups, meetis] = await Promise.all([
			Groups.findAll({
				where: {
					userId: req.user.id,
				}
			}),
			meetiUtils.meetiAndParticipants()
		]);
		
		return res
			.send({
				title: "Admin dashboard",
				...expandData(req),
				groups,
				meetis,
			});
	} catch(err) {
		req.flash("messages", [{
			message: "Internal error",
			type: "error"
		}]);
		
		return res
			.status(500)
			.send({
				title: "Admin dashboard",
				...expandData(req),
			});
	}
});

module.exports = adminRouter;
