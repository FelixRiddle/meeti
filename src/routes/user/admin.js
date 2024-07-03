const express = require("express");
const expandData = require("../../lib/misc/expandData");

const adminRouter = express.Router();

adminRouter.get("/", async (req, res) => {
	const Groups = req.models.Groups;
	const groups = await Groups.findAll({
		where: {
			userId: req.user.id,
		}
	});
	
	return res
		.render("user/admin", {
			title: "Admin dashboard",
			...expandData(req),
			groups,
		});
});

module.exports = adminRouter;
