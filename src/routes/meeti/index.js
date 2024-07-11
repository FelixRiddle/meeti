const express = require('express');
const MeetiUtils = require('../../lib/models/MeetiUtils');
const expandData = require('../../lib/misc/expandData');
const moment = require("moment");

const meetiRouter = express.Router();

meetiRouter.get("/:slug", async (req, res, next) => {
	try {
		const slug = req.params.slug;
		
		const meetiUtils = new MeetiUtils(req.models, req.user);
		const completeMeetiModel = await meetiUtils.completeMeetiInformation(slug);
		
		if(!completeMeetiModel) {
			return next();
		}
		
		const extra = await expandData(req);
		return res.render("meeti/index", {
			...extra,
			meeti: completeMeetiModel,
			title: completeMeetiModel.title,
			moment,
		});
	} catch(err) {
		console.error(err);
		return res.redirect('/500');
	}
});

module.exports = meetiRouter;
