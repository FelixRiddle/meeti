const express = require("express");
const color = require("ansi-color");

const userGroupRest = require("../../../../lib/middleware/rest/userGroupRest");
const expandData = require("../../../../lib/misc/expandData");
const { renderDataInternalErrorMessage } = require("../../../../lib/status/messages");

const deleteRouter = express.Router();

deleteRouter.delete("/:groupId", userGroupRest, async(req, res) => {
	try {
		console.log(`[DELETE] /rest/user/group/delete/${req.params.groupId}`);
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
		
		const extraData = await expandData(req);
		return res.send({
			...extraData,
		});
	} catch(err) {
		console.error(err);
		const extraData = await expandData(req);
		return res
			.status(500)
			.send({
				...extraData,
				...renderDataInternalErrorMessage,
			});
	}
});

module.exports = deleteRouter;
