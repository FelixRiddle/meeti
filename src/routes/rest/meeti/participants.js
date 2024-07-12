const express = require('express');
const MeetiUtils = require('../../../lib/models/MeetiUtils');
const expandData = require('../../../lib/misc/expandData');
const { renderDataInternalErrorMessage } = require('../../../lib/status/messages');

const participantsRouter = express.Router();

participantsRouter.get("/:slug", async (req, res, next) => {
	try {
		const slug = req.params.slug;
		
		// This gives more information than that is needed, but for now it's fine
		const meetiUtils = new MeetiUtils(req.models, req.user);
		const meeti = await meetiUtils.completeMeetiInformation(slug);
		
		if(!meeti) {
			return next();
		}
		
		const extra = await expandData(req);
		return res.send({
			...extra,
			meeti,
		});
	} catch(err) {
		console.error(err);
		return res.status(500)
			.send({
				...renderDataInternalErrorMessage
			});
	}
});

module.exports = participantsRouter;
