const express = require("express");

const adminRouter = express.Router();

adminRouter.get("/", (req, res) => {
	return res
		.render("user/admin", {
			title: "Admin dashboard"
		});
});

module.exports = adminRouter;
