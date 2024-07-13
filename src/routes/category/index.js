const express = require("express");
const moment = require('moment');

const expandData = require("../../lib/misc/expandData");

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
			}
		});
		
		if(!category) {
			req.flash("messages", [{
				message: "Category not found",
				type: "error"
			}]);
			
			res.redirect("status");
			
			return next();
		}
		
		const meetis = await Meeti.findAll({
			include: [{
				model: Groups,
				where: {
					socialCategoryId: category.id,
				}
			}, {
				model: User
			}]
		});
		
		const extra = await expandData(req);
		return res
			.render("category/index", {
				title: `Category ${category.name}`,
				...extra,
				meetis,
				moment,
			});
	} catch(err) {
		console.error(err);
		return res
			.status(500)
			.redirect("/500");
	}
});

module.exports = categoryRouter;
