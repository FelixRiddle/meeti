const express = require("express");

const resetRouter = express.Router();

resetRouter.get("/", (req, res) => {
	return res.render("user/password/reset", {
		title: "Change password"
	});
});

module.exports = resetRouter;
