const express = require('express');
const expandData = require('../../../lib/misc/expandData');

const createMeetiRouter = express.Router();

createMeetiRouter.get("/", async (req, res) => {
	try {
		const Groups = req.models.Groups;
		const groups = await Groups.findAll({
			where: {
				userId: req.user.id
			},
			raw: true,
		});
		
		return res.render("user/meeti/create", {
			title: "Create Meeti",
			groups,
			...expandData(req),
		});
	} catch(err) {
		console.error(err);
		return res.redirect("500");
	}
});

module.exports = createMeetiRouter;
