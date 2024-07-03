const express = require('express');
const { v4: uuidv4 } = require("uuid");
const expandData = require("../../../lib/misc/expandData");
const { renderDataInternalErrorMessage } = require('../../../lib/status/messages');

const newRouter = express.Router();

newRouter.get("/", async (req, res) => {
	const SocialCategory = req.models.SocialCategory;
	const categories = await SocialCategory.findAll({
		raw: true,
	});
	
	return res.render("user/group/new", {
		title: "Create new group",
		...expandData(req),
		categories,
	});
});

newRouter.post(
	"/",
	// TODO: Limit body to 4096 bytes
	async (req, res) => {
		try {
			const groupData = req.body;
			const group = {
				...groupData,
				id: uuidv4(),
				// For now
				image: ""
			};
			
			const SocialCategory = req.models.SocialCategory;
			const categories = await SocialCategory.findAll({
				raw: true,
			});
			
			try {
				const Groups = req.models.Groups;
				await Groups.create(group);
			} catch(err) {
				console.error(err);
				
				req.flash('messages', [{
					message: err.msg,
					error: true,
					type: "error"
				}]);
				
				return res
					.status(400)
					.render("user/group/new", {
						title: "Create new group",
						...expandData(req),
						categories,
					});
			}
			
			req.flash("messages", [{
				message: "Group created",
				error: false,
				type: "success"
			}]);
			
			return res
				.render("user/admin", {
					title: "Admin dashboard",
					...expandData(req),
				});
		} catch(err) {
			console.error(err);
			return res
				.status(500)
				.render("status", {
					...renderDataInternalErrorMessage,
				});
		}
	}
);

module.exports = newRouter;
