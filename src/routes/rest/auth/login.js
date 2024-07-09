const express = require("express");
const { renderDataInternalErrorMessage } = require("../../../lib/status/messages");
const validatePassword = require("../../../lib/auth/validatePassword");
const generateJwtToken = require("../../../lib/auth/generateToken");
const expandData = require("../../../lib/misc/expandData");

const loginRouter = express.Router();

loginRouter.post("/", async (req, res) => {
	try {
		const {
			email, password
		} = req.body;
		if(!email || !password) {
			const extraData = await expandData(req);
			return res.status(400).send({
				...extraData,
                messages: [{
                    message: "Both the email and password are required",
                    error: true,
                }],
            });
		}
		
		const User = req.models.User;
		
		// Find user in the database
		const user = await User.findOne({
			where: {
				email
			},
			raw: true,
		});
		
		// Validate password
		const passwordOk = validatePassword(password, user.password);
		if(!passwordOk) {
			const extraData = await expandData(req);
			return res.status(401).send({
				...extraData,
                messages: [{
                    message: "Email or password incorrect",
                    error: true,
                }],
            });
		}
		
		// Remove password
		delete user.password;
		// Just in case
		delete user.token;
		
		const token = generateJwtToken(user);
		
		const extraData = await expandData(req);
		return res
			.cookie("token", token, {
				httpOnly: false,
			}).send({
				...extraData,
				messages: [{
					message: "Logged in",
					error: false,
					type: "success"
				}],
				token,
			});
	} catch(err) {
		console.error(err);
		
		const extraData = await expandData(req);
		return res
			.status(500)
			.send({
				...extraData,
				...renderDataInternalErrorMessage
			});
	}
});

module.exports = loginRouter;
