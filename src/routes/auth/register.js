const express = require("express");

const registerRouter = express.Router();

registerRouter.get("/", (req, res) => {
	return res.render("auth/register", {
		title: "Register"
	});
});

module.exports = registerRouter;
