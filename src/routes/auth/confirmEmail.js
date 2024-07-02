const express = require("express");
const { renderDataInternalErrorMessage } = require("../../lib/status/messages");

const confirmEmailRouter = express.Router();

confirmEmailRouter.get("/:token", async (req, res) => {
	try {
		const token = req.params.token;
		
		const User = req.models.User;
		const user = User.findOne({
			where: {
				token
			}
		});
		
		if(!user) {
			return res.render("auth/confirm-email", {
				title: "Email verification",
				messages: [{
					message: "The email couldn't be verified because the user doesn't exists.",
					error: true,
					type: "error"
				}]
			});
		}
		
		user.emailConfirmed = true;
		await user.save();
		
		return res.render("auth/confirm-email", {
			title: "Email confirmed",
			messages: [{
				message: "The email has been confirmed",
				error: false,
				type: "success"
			}]
		});
	} catch(err) {
		console.error(err);
		return res.render("auth/confirm-email", {
			title: "Error the email couldn't be verified",
			...renderDataInternalErrorMessage
		});
	}
});

module.exports = confirmEmailRouter;
