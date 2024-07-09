const express = require('express');
const { v4: uuidv4 } = require("uuid");

const expandData = require("../../../../lib/misc/expandData");
const { renderDataInternalErrorMessage } = require('../../../../lib/status/messages');
const CREATE_GROUP_VALIDATION = require("../../../../lib/routes/validation/createGroupValidation");
const optRestUploadGroupImage = require('../../../../lib/uploads/rest/optRestUploadGroupImage');

const newRouter = express.Router();

newRouter.post(
	"/",
	optRestUploadGroupImage,
	CREATE_GROUP_VALIDATION,
	async (req, res) => {
		try {
			console.log(`[POST] /rest/user/group/new`);
			
			const groupData = req.body;
			const group = {
				...groupData,
				id: uuidv4(),
				userId: req.user.id,
				socialCategoryId: groupData.category ? Number(groupData.category) : undefined,
				image: req.file ? req.file.filename : "",
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
				
				const extraData = await expandData(req);
				return res
					.status(400)
					.send({
						...extraData,
					});
			}
			
			req.flash("messages", [{
				message: "Group created",
				error: false,
				type: "success"
			}]);
			
			const extraData = await expandData(req);
			return res
				.send({
					...extraData,
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
