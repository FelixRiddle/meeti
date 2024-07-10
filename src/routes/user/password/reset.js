const express = require("express");
const { body, validationResult } = require("express-validator");

const expandData = require("../../../lib/misc/expandData");
const VALIDATE_PASSWORDS = require("../../../lib/routes/validation/validatePassword");
const { MIN_PASSWORD_LENGTH, SHORT_STRING_LENGTH } = require("../../../lib/routes/validation/constants");

const resetRouter = express.Router();

resetRouter.get("/", async (req, res) => {
	const extraData = await expandData(req);
	return res.render("user/password/reset", {
		title: "Change password",
		...extraData
	});
});

resetRouter.post(
	"/",
	[
		...VALIDATE_PASSWORDS,
		body(
			"newPassword",
			`New password must be between ${MIN_PASSWORD_LENGTH} and ${SHORT_STRING_LENGTH}`
		).isLength({
			min: MIN_PASSWORD_LENGTH,
			max: SHORT_STRING_LENGTH
		}),
	],
	async (req, res) => {
		try {
			const {
				User
			} = req.models;
			
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
				return res.render("user/password/reset", {
					title: "Change password",
					...extraData,
					...req.body,
				});
			}
			
			// Validate that given passwords are equal
			if(!(req.body.newPassword === req.body.confirmPassword)) {
				req.flash('messages', [{
					message: "Passwords don't match",
					type: "error"
				}]);
				
				const extraData = await expandData(req);
				return res.render("user/password/reset", {
					title: "Change password",
					...extraData,
					...req.body,
				});
			}
			
			// Validate that passwords match
			const user = await User.findByPk(req.user.id);
			if(!user.validatePassword(req.body.password)) {
				req.flash('messages', [{
					message: "Your actual password is incorrect",
					type: "error"
				}]);
				
				const extraData = await expandData(req);
				return res.render("user/password/reset", {
					title: "Change password",
					...extraData,
					...req.body,
				});
			}
			
			// Hash password
			const newPassword = user.hashPassword(req.body.newPassword);
			user.password = newPassword;
			await user.save();
			
			req.flash("messages", [{
				message: "Password modified",
				type: "success"
			}]);
			
			return res.redirect("back");
		} catch(err) {
			console.error(err);
			return res.redirect('500');
		}
	}
);

module.exports = resetRouter;