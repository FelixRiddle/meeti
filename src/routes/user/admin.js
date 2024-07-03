const express = require("express");
const expandData = require("../../lib/misc/expandData");

const adminRouter = express.Router();

adminRouter.get("/", (req, res) => {
	return res
		.render("user/admin", {
			title: "Admin dashboard",
			...expandData(req),
		});
});

module.exports = adminRouter;
