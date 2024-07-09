const express = require("express");
const expandData = require("../../lib/misc/expandData");

/**
 * Login router
 */
function loginRouter(passport) {
	const router = express.Router();
	
	router.get("/", async (req, res) => {
		const extraData = await expandData(req);
		return res.render("auth/login", {
			title: "Login",
			userData: {
				email: "",
				password: "",
			},
			...extraData
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

