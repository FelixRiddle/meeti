const express = require("express");
const expandData = require("../../../lib/misc/expandData");

const resetRouter = express.Router();

resetRouter.get("/", async (req, res) => {
	const extraData = await expandData(req);
	return res.render("user/password/reset", {
		title: "Change password",
		...extraData
	});
});

module.exports = resetRouter;
