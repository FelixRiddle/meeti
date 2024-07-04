const express = require("express");
const groupExistsUserOwnsIt = require("../../../../lib/middleware/groupExistsUserOwnsIt");
const { renderDataInternalErrorMessage } = require("../../../../lib/status/messages");

const getRouter = express.Router();

getRouter.get("/:groupId", groupExistsUserOwnsIt, async (req, res) => {
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
