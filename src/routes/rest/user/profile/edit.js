const express = require("express");
const { validationResult } = require("express-validator");

const USER_PROFILE_VALIDATION = require("../../../../lib/routes/validation/userProfileValidation");
const expandData = require("../../../../lib/misc/expandData");
const { renderDataInternalErrorMessage } = require("../../../../lib/status/messages");

const editRouter = express.Router();

editRouter.post("/", USER_PROFILE_VALIDATION, async(req, res) => {
	try {
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
			return res
				.status(400)
				.send({
					...extraData
				});
		}
		
		const {
			User
		} = req.models;
		const user = await User.findByPk(req.user.id);
		
		// FIXME: The user has to validate the mail
		// Update user data
		Object.assign(user, req.body);
		
		// Save user
		await user.save();
		
		// TODO: Revalidate session
		req.flash("messages", [{
			message: "User profile updated",
			type: "success"
		}]);
		
		const extraData = await expandData(req);
		return res.send({
			...extraData
		});
	} catch(err) {
		console.error(err);
		return res.status(500)
			.send({
				...renderDataInternalErrorMessage
			});
	}
});

module.exports = editRouter;
