const express = require('express');
const expandData = require("../../../lib/misc/expandData");
const { renderDataInternalErrorMessage } = require('../../../lib/status/messages');

const newRouter = express.Router();

newRouter.get("/", async (req, res) => {
	const SocialCategory = req.models.SocialCategory;
	
	const categories = await SocialCategory.findAll({
		raw: true,
	});
	console.log(`Categories: `, categories);
	
	return res.render("user/group/new", {
		title: "Create new group",
		...expandData(req),
		categories,
	});
});

newRouter.post("/", (req, res) => {
	try {
		
	} catch(err) {
		console.error(err);
		return res
			.status(500)
			.render("status", {
				...renderDataInternalErrorMessage
			});
	}
});

module.exports = newRouter;
