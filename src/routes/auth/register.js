const express = require("express");
const { renderDataInternalErrorMessage } = require("../../lib/status/messages");

const registerRouter = express.Router();

registerRouter.get("/", (req, res) => {
	return res.render("auth/register", {
		title: "Register"
	});
});

registerRouter.post("/", async (req, res) => {
	try {
		const userData = req.body;
		
		// Validate passwords match
		const passwordsMatch = userData.password === userData.confirmPassword;
		if(!passwordsMatch) {
			const message = "Passwords don't match";
			
			return res
				.status(400)
				.render("auth/register", {
					title: message,
					messages: [{
						message,
						error: true,
					}]
				});
		}
		
		const User = req.models.User;
		const user = await User.create(userData);
		
		return res.render("status", {
			title: "Account created successfully",
			subtitle: "",
		});
	} catch(err) {
		console.error(err);
		return res
			.status(500)
			.render("status", renderDataInternalErrorMessage);
	}
});

module.exports = registerRouter;
