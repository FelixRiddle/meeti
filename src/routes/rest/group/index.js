const express = require('express');
const { internalErrorMessage } = require('../../../lib/status/messages');

const groupRouter = express.Router();

groupRouter.get("/categories", async(req, res) => {
	try {
		const SocialCategory = req.models.SocialCategory;
		const categories = await SocialCategory.findAll({ raw: true });
		
		return res
			.send({
				categories,
			});
	} catch(err) {
		console.error(err);
		return res.status(500)
			.send({
				messages: [internalErrorMessage]
			});
	}
});

module.exports = groupRouter;
