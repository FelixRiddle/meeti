const express = require("express");

const { renderDataInternalErrorMessage } = require("../../../../lib/status/messages");
const expandData = require("../../../../lib/misc/expandData");
const CREATE_GROUP_VALIDATION = require("../../../../lib/routes/validation/createGroupValidation");
const { validationResult } = require("express-validator");

const editRouter = express.Router();

editRouter.get("/:groupId", async (req, res) => {
	try {
		const groupId = req.params.groupId;
		
		const Groups = req.models.Groups;
		const SocialCategory = req.models.SocialCategory;
		
		const [group, categories] = await Promise.all([
			Groups.findByPk(groupId),
			SocialCategory.findAll()
		]);
		
		const extraData = await expandData(req);
		return res.send({
			group,
			categories,
			...extraData,
		});
	} catch(err) {
		console.error(err);
		const extraData = await expandData(req);
		return res.status(500).send({
			...renderDataInternalErrorMessage,
			...extraData,
		});
	}
});

editRouter.post(
	"/:groupId",
	CREATE_GROUP_VALIDATION,
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
				
				const extraData = await expandData(req);
				return res.status(400).send({
					...extraData,
				});
			}
			
			// Get group
			const groupId = req.params.groupId;
			const Groups = req.models.Groups;
			const groupModel = await Groups.findOne({
				where: {
					id: groupId,
				}
			});
			if(!groupModel) {
				req.flash('messages', [{
					message: "The group doesn't exists",
					type: "error",
				}]);
				
				const extraData = await expandData(req);
				return res.status(404).send({
					...extraData,
				});
			}
			
			// Verify that this person is the author
			const userId = req.user.id;
			const isOwner = groupModel.userId === userId;
			if(!isOwner) {
				req.flash('messages', [{
					message: "You're not the owner of this property, reputation -1",
					type: "error",
					baddie: true,
				}]);
				
				const extraData = await expandData(req);
				return res.status(403).send({
					...extraData,
				});
			}
			
			// Validate keys
			// Fields were already validated we have to make sure there are no more than 4 only
			if(Object.keys(group).length > 4) {
				req.flash("messages", [{
					message: "Incorrect object given",
					type: "error",
					// This won't happen without intervention
					baddie: true,
				}]);
				
				const extraData = await expandData(req);
				return res.status(401).send({
					...extraData,
				});
			}
			
			// Update data
			for(const [key, value] of Object.entries(group)) {
				groupModel[key] = value;
			}
			await groupModel.save();
			
			req.flash("messages", [{
				message: "Property updated",
				type: "success"
			}]);
			
			const extraData = await expandData(req);
			return res.send({
				...extraData,
			});
		} catch(err) {
			console.error(err);
			const extraData = await expandData(req);
			return res
				.status(500)
				.send({
					...renderDataInternalErrorMessage,
					...extraData,
				});
		}
	}
);

module.exports = editRouter;
