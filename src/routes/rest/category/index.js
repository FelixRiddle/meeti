const express = require("express");
const moment = require('moment');

const expandData = require('../../../lib/misc/expandData');

const categoryRouter = express.Router();

// Show meetis by category
categoryRouter.get("/:nameId", async (req, res, next) => {
	try {
		const nameId = req.params.nameId;
		
		const {
			Groups,
			Meeti,
			SocialCategory,
			User
		} = req.models;
		
		const category = await SocialCategory.findOne({
			where: {
				nameId,
			},
			raw: true,
		});
		
		if(!category) {
			req.flash("messages", [{
				message: "Category not found",
				type: "error"
			}]);
			
			const extra = await expandData(req);
			return res.status(404)
				.send({
					...extra,
				});
		}
		
		const meetiModels = await Meeti.findAll({
			order: [
				["date", "ASC"],
				["time", "ASC"]
			],
			include: [{
				model: Groups,
				where: {
					socialCategoryId: category.id,
				},
				include: [{
					model: SocialCategory,
				}]
			}, {
				model: User
			}]
		});
		
		let meetis = [];
		for(const meeti of meetiModels) {
			meetis.push(JSON.parse(JSON.stringify(meeti)));
		}
		
		const extra = await expandData(req);
		return res
			.send({
				title: `Category ${category.name}`,
				...extra,
				meetis,
				category
			});
	} catch(err) {
		console.error(err);
		const extra = await expandData(req);
		return res
			.status(500)
			.send({
				...extra
			});
	}
});

module.exports = categoryRouter;
