const express = require("express");
const groupExistsUserOwnsIt = require("../../../lib/middleware/groupExistsUserOwnsIt");

const deleteRouter = express.Router();

deleteRouter.get("/:groupId", groupExistsUserOwnsIt, async(req, res) => {
	const group = req.group.get({ raw: true });
	
	return res.render("user/group/delete", {
		title: "Delete group",
		group,
	});
});

deleteRouter.delete("/:groupId", groupExistsUserOwnsIt, async(req, res) => {
	
});

module.exports = deleteRouter;
