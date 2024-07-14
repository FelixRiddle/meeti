const express = require("express");
const { validationResult } = require("express-validator");

const { renderDataInternalErrorMessage } = require("../../../lib/status/messages");
const expandData = require("../../../lib/misc/expandData");
const CREATE_GROUP_VALIDATION = require("../../../lib/routes/validation/createGroupValidation");
const groupExistsUserOwnsIt = require("../../../lib/middleware/groupExistsUserOwnsIt");

const editRouter = express.Router();

editRouter.get(
	"/:groupId",
	async (req, res) => {
		try {
			const groupId = req.params.groupId;
			
			const Groups = req.models.Groups;
			const SocialCategory = req.models.SocialCategory;
			
			const [group, categories] = await Promise.all([
				Groups.findByPk(groupId),
				SocialCategory.findAll()
			]);
			
			const extraData = await expandData(req);
			return res.render("user/group/edit", {
				title: group.name,
				group,
				categories,
				...extraData,
			});
		} catch(err) {
			console.error(err);
			const extraData = await expandData(req);
			return res
				.status(500)
				.render("status", {
					...renderDataInternalErrorMessage,
					...extraData,
				});
		}
	}
);

editRouter.post(
	"/:groupId",
	CREATE_GROUP_VALIDATION,
	groupExistsUserOwnsIt,
	async (req, res) => {
		try {
			const group = req.body;
			
			// Validate data
			const result = validationResult(req);
			if(!result.isEmpty()) {
				const resultMessages = result.array();
				
				const messages = resultMessages.map((data) => {
					return {
						message: data.msg,
						error: true,
						type: "error"
					}
				});
				req.flash("messages", messages);
				
				const SocialCategory = req.models.SocialCategory;
				const categories = await SocialCategory.findAll();
				
				const extraData = await expandData(req);
				return res.render("user/group/edit", {
					title: group.name,
					group,
					categories,
					...extraData,
				});
			}
			
			// Validate keys
			// Fields were already validated we have to make sure there are no more than 4 only
			if(Object.keys(group).length > 4) {
				req.flash("messages", [{
					message: "Incorrect object given",
					type: "error",
					// This is endpoint tampering
					tampering: true,
				}]);
				
				return res
					.redirect("/user/admin");
			}
			
			// Update data
			const groupModel = req.group;
			for(const [key, value] of Object.entries(group)) {
				groupModel[key] = value;
			}
			await groupModel.save();
			
			req.flash("messages", [{
				message: "Property updated",
				type: "success"
			}]);
			
			return res
				.redirect("/user/admin");
		} catch(err) {
			console.error(err);
			return res
				.status(500)
				.redirect("500");
		}
	}
);

module.exports = editRouter;
