const express = require('express');
const MeetiUtils = require('../../lib/models/MeetiUtils');
const expandData = require('../../lib/misc/expandData');

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
		
		console.log(`Meeti: `, meeti);
		
		const extra = await expandData(req);
		return res.render("meeti/participants", {
			...extra,
			meeti,
		});
	} catch(err) {
		console.error(err);
		return res.redirect('500');
	}
});

module.exports = participantsRouter;
