const express = require("express");
const expandData = require("../../lib/misc/expandData");

const adminRouter = express.Router();

adminRouter.get("/", async (req, res) => {
	const {
		Groups,
		Meeti,
		User,
	} = req.models;
	const [groups, meetis] = await Promise.all([
		Groups.findAll({
			where: {
				userId: req.user.id,
			}
		}),
		Meeti.findAll({
			where: {
				userId: req.user.id
			},
			include: [User]
		})
	]);
	
	console.log(`Groups: `, groups);
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
