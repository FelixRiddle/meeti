const express = require("express");
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

module.exports = loginRouter;

