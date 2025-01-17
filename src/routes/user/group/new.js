const express = require('express');
const { v4: uuidv4 } = require("uuid");

const expandData = require("../../../lib/misc/expandData");
const { renderDataInternalErrorMessage } = require('../../../lib/status/messages');
const CREATE_GROUP_VALIDATION = require("../../../lib/routes/validation/createGroupValidation");
const uploadGroupImage = require('../../../lib/uploads/uploadGroupImage');

const newRouter = express.Router();

newRouter.get("/", async (req, res) => {
	const SocialCategory = req.models.SocialCategory;
	const categories = await SocialCategory.findAll({
		raw: true,
	});
	
	const extraData = await expandData(req);
	return res.render("user/group/new", {
		title: "Create new group",
		...extraData,
		categories,
	});
});

newRouter.post(
	"/",
	uploadGroupImage,
	CREATE_GROUP_VALIDATION,
	async (req, res) => {
		try {
			const groupData = req.body;
			const group = {
				...groupData,
				id: uuidv4(),
				userId: req.user.id,
				socialCategoryId: Number(groupData.category),
				image: req.file ? req.file.filename : "",
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
				
				const errorsSequelize = err.errors.map((err) => {
					return {
						message: err.message,
						error: true,
						type: "error"
					};
				});
				
				req.flash('messages', [...errorsSequelize]);
				
				const extraData = await expandData(req);
				return res
					.status(400)
					.render("user/group/new", {
						title: "Create new group",
						...extraData,
						categories,
						groupData,
					});
			}
			
			req.flash("messages", [{
				message: "Group created",
				error: false,
				type: "success"
			}]);
			
			const extraData = await expandData(req);
			return res
				.render("user/admin", {
					title: "Admin dashboard",
					...extraData,
				});
		} catch(err) {
			console.error(err);
			return res
				.status(500)
				.redirect("500");
		}
	}
);

module.exports = newRouter;
