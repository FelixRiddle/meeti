const express = require('express');

const { renderDataInternalErrorMessage } = require('../../../lib/status/messages');
const expandData = require('../../../lib/misc/expandData');

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
			req.flash("messages", [{
				message: "User doesn't exists",
				type: "error"
			}]);
			
			const extra = await expandData(req);
			return res.status(404)
				.send({
					...extra,
				});
		}
		
		const extra = await expandData(req);
		return res.send({
			title: userProfile.name,
			userProfile,
			groups,
			...extra,
		});
	} catch(err) {
		console.error(err);
		return res
			.status(500)
			.send({
				...renderDataInternalErrorMessage
			});
	}
});

module.exports = usersRouter;
