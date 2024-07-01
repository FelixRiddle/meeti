const express = require("express");
const { internalErrorMessage, renderDataInternalErrorMessage } = require("../../../lib/status/messages");

const registerRouter = express.Router();

registerRouter.post("/", async (req, res) => {
	try {
		const userData = req.body;
		
		const passwordsMatch = userData.password === userData.confirmPassword;
		if(!passwordsMatch) {
			return res
				.status(400)
				.send({
					messages: [{
						message: "Passwords don't match",
						error: true,
					}]
				});
		}
		
		// Lowercase the email
		userData.email = userData.email.toLowerCase();
		
		const User = req.models.User;
		await User.create(userData);
		
		return res.send({
			messages: [{
				message: "Account created",
				error: false,
			}]
		});
	} catch(err) {
		console.error(err);
		return res
			.status(500)
			.send(renderDataInternalErrorMessage);
	}
});

module.exports = registerRouter;
