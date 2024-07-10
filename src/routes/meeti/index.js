const express = require('express');

const meetiRouter = express.Router();

meetiRouter.get("/:slug", async (req, res, next) => {
	try {
		const {
			Meeti,
			Groups,
			User,
		} = req.models;
		
		const meetiModel = await Meeti.findOne({
			where: {
				slug: req.params.slug,
			},
			// attributes: ["slug", "title", "date", "time", "id"],
			order: [
				["date", "ASC"]
			],
			include: [{
				model: Groups,
				// attributes: ["image"]
			}, {
				model: User,
				// attributes: ['id', 'name', 'pfp']
			}]
		});
		
		if(!meetiModel) {
			return next();
		}
		
		const meeti = meetiModel.get({raw: true});
		meeti.group = meeti.group.get({raw: true});
		meeti.user = meeti.user.get({raw: true});
		
		return res.render("meeti/index", {
			meeti,
			title: meeti.title,
		});
	} catch(err) {
		console.error(err);
		return res.redirect('/500');
	}
});

module.exports = meetiRouter;
