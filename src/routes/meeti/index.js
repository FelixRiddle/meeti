const express = require('express');
const moment = require("moment");

const MeetiUtils = require('../../lib/models/MeetiUtils');
const expandData = require('../../lib/misc/expandData');
const participantsRouter = require("./participants");

const meetiRouter = express.Router();

meetiRouter.use("/participants", participantsRouter);

meetiRouter.get("/:slug", async (req, res, next) => {
	try {
		const {
			Comment,
			User,
		} = req.models;
		
		const slug = req.params.slug;
		
		// Get complete meeti model
		const meetiUtils = new MeetiUtils(req.models, req.user);
		const completeMeetiModel = await meetiUtils.completeMeetiInformation(slug);
		if(!completeMeetiModel) {
			return next();
		}
		
		// Check if user participates in the meeti
		const userParticipates = meetiUtils.userParticipates(completeMeetiModel);
		
		// Get meeti comments
		const commentsModel = await Comment.findAll({
			where: {
				meetiId: completeMeetiModel.id,
			},
			include: [{
				model: User,
				attributes: ["id", "name", "pfp"],
			}],
		});
		
		// Remove ORM properties
		const comments = JSON.parse(JSON.stringify(commentsModel));
		
		const extra = await expandData(req);
		return res.render("meeti/index", {
			...extra,
			comments: comments,
			meeti: completeMeetiModel,
			title: completeMeetiModel.title,
			moment,
			userParticipates,
		});
	} catch(err) {
		console.error(err);
		return res.redirect('/500');
	}
});

module.exports = meetiRouter;
