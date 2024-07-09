const express = require("express");
const { validationResult } = require("express-validator");

const expandData = require("../../../lib/misc/expandData");
const USER_PROFILE_VALIDATION = require('../../../lib/routes/validation/userProfileValidation');

const editRouter = express.Router();

editRouter.get("/", async (req, res) => {
	try {
		const {
			User
		} = req.models;
		
		// TODO: Revalidate session and this won't be needed
		const user = await User.findByPk(req.user.id, {
			raw: true,
		});
		
		return res.render("user/profile/edit", {
			title: "Edit profile",
			...expandData(req),
			user,
		});
	} catch(err) {
		console.error(err);
		return res.redirect("500");
	}
});

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
			
			return res
				.status(400)
				.render("user/profile/edit", {
					title: "Edit profile",
					...expandData(req)
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
		
		return res.redirect("/user/admin");
	} catch(err) {
		console.error(err);
		return res.redirect("/500");
	}
})

module.exports = editRouter;
