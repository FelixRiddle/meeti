const express = require('express');
const expandData = require("../../../../lib/misc/expandData");
const { renderDataInternalErrorMessage } = require('../../../../lib/status/messages');
const { v4: uuidv4 } = require("uuid");
const CREATE_GROUP_VALIDATION = require("../../../../lib/routes/validation/createGroupValidation");

const newRouter = express.Router();

newRouter.post(
	"/",
	CREATE_GROUP_VALIDATION,
	async (req, res) => {
		try {
			const groupData = req.body;
			const group = {
				...groupData,
				id: uuidv4(),
				userId: req.user.id,
				socialCategoryId: Number(groupData.category),
				// For now
				image: ""
			};
			
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
					.send({
						...expandData(req),
					});
			}
			
			req.flash("messages", [{
				message: "Group created",
				error: false,
				type: "success"
			}]);
			
			return res
				.send({
					...expandData(req),
				});
		} catch(err) {
			console.error(err);
			return res
				.status(500)
				.send({
					...renderDataInternalErrorMessage,
				});
		}
	}
);

module.exports = newRouter;
