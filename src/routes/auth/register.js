const express = require("express");
const { validationResult } = require("express-validator");
const { v4: uuidv4 } = require('uuid');

const sendMail = require("../../lib/handler/emails");
const REGISTER_VALIDATION = require("../../lib/routes/validation/registerValidation");
const expandData = require("../../lib/misc/expandData");

/**
 * Register router
 */
function registerRouter() {
	const router = express.Router();
	
	router.get("/", async (req, res) => {
		const extraData = await expandData(req);
		return res.render("auth/register", {
			title: "Register",
			userData: {
				email: "",
				name: "",
				password: "",
				confirmPassword: ""
			},
			...extraData
		});
	});
	
	router.post(
		"/",
		REGISTER_VALIDATION,
		async (req, res) => {
			const title = "Register";
			try {
				const userData = req.body;
				
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
						.render("auth/register", {
							title,
							...extraData,
							messages,
							userData,
						});
				}
				
				// Validate passwords match
				const passwordsMatch = userData.password === userData.confirmPassword;
				if(!passwordsMatch) {
					const message = "Passwords don't match";
					
					const extraData = await expandData(req);
					return res
						.status(400)
						.render("auth/register", {
							title,
							...extraData,
							messages: [{
								message,
								error: true,
								type: "error"
							}],
							userData,
						});
				}
				
				let user = undefined;
				let magicLink = "";
				try {
					const token = uuidv4();
					const newUser = {
						...userData,
						token,
					};
					
					const User = req.models.User;
					
					user = await User.create(newUser);
					magicLink = `http://${req.headers.host}/confirm-account/${token}`;
				} catch(err) {
					const errorsSequelize = err.errors.map((err) => {
						return {
							message: err.message,
							error: true,
							type: "error"
						};
					});
					
					const extraData = await expandData(req);
					return res
						.status(400)
						.render("auth/register", {
							title,
							...extraData,
							messages: [...errorsSequelize],
							userData,
						});
				}
				
				// Check if mail is enabled
				if(!process.env.DISABLE_MAIL) {
					try {
						// Send confirmation email
						await sendMail({
							user,
							magicLink,
							subject: "Confirm your account",
							// EJS file
							filename: 'confirm-account',
						});
					} catch(err) {
						console.error(err);
						return res
							.status(500)
							.redirect("500");
					}
				}
				
				const extraData = await expandData(req);
				const message = "Account created successfully";
				return res
					.render("auth/register", {
						title,
						...extraData,
						messages: [{
							message,
							error: false,
							type: "success"
						}],
						userData: {
							email: "",
							name: "",
							password: "",
							confirmPassword: ""
						}
					});
			} catch(err) {
				console.error(err);
				
				return res
					.status(500)
					.redirect("500");
			}
		}
	);
	
	return router;
}

module.exports = registerRouter;
