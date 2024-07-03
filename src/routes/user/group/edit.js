const express = require("express");
const { renderDataInternalErrorMessage } = require("../../../lib/status/messages");
const expandData = require("../../../lib/misc/expandData");

const editRouter = express.Router();

editRouter.get("/:groupId", async (req, res) => {
	try {
		const groupId = req.params.groupId;
		console.log(`Group id: `, groupId);
		
		const Groups = req.models.Groups;
		const SocialCategory = req.models.SocialCategory;
		
		const [group, categories] = await Promise.all([
			Groups.findByPk(groupId),
			SocialCategory.findAll()
		]);
		
		return res.render("user/group/edit", {
			title: group.name,
			group,
			categories,
			...expandData(req),
		});
	} catch(err) {
		console.error(err);
		return res.status(500).render("status", {
			...renderDataInternalErrorMessage,
			...expandData(req),
		});
	}
});

module.exports = editRouter;
