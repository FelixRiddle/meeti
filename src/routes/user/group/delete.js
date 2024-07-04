const express = require("express");
const fs = require("fs");
const color = require("ansi-color");

const groupExistsUserOwnsIt = require("../../../lib/middleware/groupExistsUserOwnsIt");
const expandData = require("../../../lib/misc/expandData");
const { renderDataInternalErrorMessage } = require("../../../lib/status/messages");

const deleteRouter = express.Router();

deleteRouter.get("/:groupId", groupExistsUserOwnsIt, async(req, res) => {
	const group = req.group.get({ raw: true });
	
	return res.render("user/group/delete", {
		title: `Delete group ${group.name}`,
		group,
		...expandData(req),
	});
});

deleteRouter.post("/:groupId", groupExistsUserOwnsIt, async(req, res) => {
	try {
		const group = req.group;
		
		// Group
		if(group.image) {
			try {
				// Delete image
				fs.rmSync(`public/uploads/groups/${group.image}`);
			} catch(err) {
				// Image doesn't exists
			}
		}
		
		await group.destroy();
		
		const message = "Group deleted";
		console.log(color.set(message, "green"));
		req.flash("messages", [{
			message,
			type: "success"
		}]);
		
		return res.redirect("/user/admin");
	} catch(err) {
		console.error(err);
		return res
			.status(500)
			.render("status", {
				...renderDataInternalErrorMessage,
				...expandData(req),
			});
	}
});

module.exports = deleteRouter;
