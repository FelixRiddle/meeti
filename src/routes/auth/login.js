const express = require("express");

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

module.exports = loginRouter;

