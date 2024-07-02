const express = require("express");
const { renderDataInternalErrorMessage } = require("../../../lib/status/messages");
const { body, validationResult } = require("express-validator");
const { SHORT_STRING_LENGTH } = require("../../auth/register");
const { v4: uuidv4 } = require("uuid");
const sendMail = require("../../../lib/handler/emails");

const registerRouter = express.Router();

registerRouter.post(
	"/",
	body("email", "The email can't be empty").escape().notEmpty(),
	body("email", "The email is too long").isLength({ max: SHORT_STRING_LENGTH }),
	body("email", "The email is wrong").isEmail(),
	body("name", "The name is too long").escape().isLength({ max: SHORT_STRING_LENGTH }),
	body("password", "Password is required, otherwise everyone would acces your account").notEmpty(),
	body("password", "Password is too long").isLength({ max: SHORT_STRING_LENGTH }),
	// No need to check length if we're comparing them anyways
	body("confirmPassword", "Confirm password is required").notEmpty(),
	async (req, res) => {
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
				
				return res
					.status(400)
					.send({
						messages,
					});
			}
			
			// Validate passwords match
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
				console.log(`Error: `, err);
				const errorsSequelize = err.errors.map((err) => {
					return {
						message: err.message,
						error: true,
						type: "error"
					};
				});
				
				return res
					.status(400)
					.send({
						messages: [...errorsSequelize],
						userData,
					});
			}
			
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
					.send(renderDataInternalErrorMessage);
			}
			
			return res.send({
				messages: [{
					message: "Account created",
					error: false,
					type: "success"
				}]
			});
		} catch(err) {
			console.error(err);
			return res
				.status(500)
				.send(renderDataInternalErrorMessage);
		}
	}
);

module.exports = registerRouter;