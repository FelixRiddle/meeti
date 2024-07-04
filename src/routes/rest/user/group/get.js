const express = require("express");
const { renderDataInternalErrorMessage } = require("../../../../lib/status/messages");
const userGroupRest = require("../../../../lib/middleware/rest/userGroupRest");

const getRouter = express.Router();

getRouter.get("/:groupId", userGroupRest, async (req, res) => {
	try {
		const group = req.group.get({ raw: true });
		
		return res.send({
			group
		});
	} catch(err) {
		console.error(err);
		return res
			.status(500)
			.render("status", {
				...renderDataInternalErrorMessage,
			});
	}
});

module.exports = getRouter;
