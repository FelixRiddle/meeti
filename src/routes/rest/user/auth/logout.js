const express = require("express");

const logoutRouter = express.Router();

logoutRouter.get("/logout", (req, res) => {
	return res
		.clearCookie("token")
		.send({
			messages: [{
				message: "Cookie cleared",
				type: "success"
			}]
		});
})

module.exports = logoutRouter;
