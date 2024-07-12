const express = require('express');
const expandData = require('../../lib/misc/expandData');

/**
 * Plural name should be associated with public routes that don't require authentication
 */
const usersRouter = express.Router();

usersRouter.get("/:userId", async(req, res, next) => {
	try {
		const {
			Groups,
			User
		} = req.models;
		
		const userId = req.params.userId;
		
		const [userProfile, groups] = await Promise.all([
			User.findByPk(userId),
			Groups.findAll({
				where: {
					userId,
				}
			})
		]);
		
		if(!userProfile) {
			res.redirect("/");
			return next();
		}
		
		const extra = await expandData(req);
		return res.render("users/index", {
			title: userProfile.name,
			userProfile,
			groups,
			...extra,
		});
	} catch(err) {
		console.error(err);
		return res.redirect("500");
	}
});

module.exports = usersRouter;
