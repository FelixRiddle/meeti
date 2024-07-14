const express = require('express');
const moment = require("moment");

const participantsRouter = require("./participants");
const MeetiUtils = require('../../../lib/models/MeetiUtils');
const expandData = require('../../../lib/misc/expandData');

const meetiRouter = express.Router();

meetiRouter.use("/participants", participantsRouter);

meetiRouter.get("/:slug", async (req, res, next) => {
	try {
		const slug = req.params.slug;
		
		// Get complete meeti model
		const meetiUtils = new MeetiUtils(req.models, req.user);
		const completeMeetiModel = await meetiUtils.completeMeetiInformation(slug);
		if(!completeMeetiModel) {
			return next();
		}
		
		// Check if user participates in the meeti
		const userParticipates = meetiUtils.userParticipates(completeMeetiModel);
		
		const {
			Comment,
			User
		} = req.models;
		
		// Get meeti comments
		const commentsModel = await Comment.findAll({
			where: {
				meetiId: completeMeetiModel.id,
			},
			order: [
				["createdAt", "ASC"]
			],
			include: [{
				model: User,
				attributes: ["id", "name", "pfp"],
			}],
		});
		
		// Remove ORM properties
		const comments = JSON.parse(JSON.stringify(commentsModel));
		
		const extra = await expandData(req);
		return res.send({
			...extra,
			meeti: completeMeetiModel,
			title: completeMeetiModel.title,
			moment,
			comments,
			userParticipates,
		});
	} catch(err) {
		console.error(err);
		const extra = await expandData(req);
		return res.status(500)
			.send({
				...extra
			});
	}
});

module.exports = meetiRouter;
