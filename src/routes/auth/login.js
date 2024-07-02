const express = require("express");
const { renderDataInternalErrorMessage } = require("../../lib/status/messages");
const passport = require("../../lib/config/passport");

const loginRouter = express.Router();

loginRouter.get("/", (req, res) => {
	return res.render("auth/login", {
		title: "Login",
		userData: {
			email: "",
			password: "",
		}
	});
});

const authenticate = passport.authenticate('local', {
	successRedirect: '/user/admin',
	failureRedirect: '/auth/login',
	failureFlash: true,
	badRequestMessage: "Both fields are required"
});

loginRouter.post("/", authenticate);

// loginRouter.post("/", async (req, res) => {
// 	try {
		
// 		return res.redirect("/");
// 	} catch(err) {
// 		console.err(err);
// 		return res
// 			.status(500)
// 			.render("status", {
// 				...renderDataInternalErrorMessage
// 			});
// 	}
// });

module.exports = loginRouter;

