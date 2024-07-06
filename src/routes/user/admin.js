const express = require("express");
const { Op } = require("sequelize");

const expandData = require("../../lib/misc/expandData");

const adminRouter = express.Router();

adminRouter.get("/", async (req, res) => {
	const {
		Groups,
		Meeti,
		MeetiParticipants,
		User,
	} = req.models;
	const [groups, meetiModels] = await Promise.all([
		Groups.findAll({
			where: {
				userId: req.user.id,
			}
		}),
		Meeti.findAll({
			where: {
				userId: req.user.id
			},
		})
	]);
	
	// Find meeti particpants
	let meetis = [];
	meetiModels.map(async (meetiModel, index) => {
		const meeti = JSON.parse(JSON.stringify(meetiModel));
		const participantIds = await MeetiParticipants.findAll({
			where: {
				meetiId: meeti.id,
			},
			raw: true,
		});
		
		meeti.participants = await User.findAll({
			where: {
				userId: {
					// Find an array of participants
					[Op.or]: participantIds,
				}
			}
		});
		
		meetis.push(meeti);
	});
	
	console.log(`Meetis: `, meetis);
	
	return res
		.render("user/admin", {
			title: "Admin dashboard",
			...expandData(req),
			groups,
			meetis
		});
});

module.exports = adminRouter;
