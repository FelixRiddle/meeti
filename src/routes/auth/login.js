const express = require("express");

/**
 * Login router
 */
function loginRouter(passport) {
	const router = express.Router();
	
	router.get("/", (req, res) => {
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
	
	router.post("/", authenticate);
	
	return router;
}

module.exports = loginRouter;

